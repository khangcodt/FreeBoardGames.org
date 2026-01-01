// import `fetch` to fix apollo-link-http-common's Invariant Violation:
// fetch is not found globally and no fetcher passed, to fix pass a fetch for
// your environment like https://www.npmjs.com/package/node-fetch.
(global as any).fetch = require('node-fetch');
import { GAMES_LIST } from 'games';
import noCache from 'koa-no-cache';
const cors = require('@koa/cors'); // tslint:disable-line
import { createClient } from 'redis';
import { RedisPubSub } from '@boardgame.io/redis-pubsub';
import { Server, SocketIO } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';

const PORT = parseInt(process.env.BGIO_PORT || '8001', 10);

function getDb() {
  const pgUrl = process.env.POSTGRES_URL;
  if (!pgUrl) {
    return;
  }
  return new PostgresStore(pgUrl);
}

async function getTransport(origins: string[]) {
  const host = process.env.FBG_REDIS_HOST;
  const port = process.env.FBG_REDIS_PORT;
  const password = process.env.FBG_REDIS_PASSWORD;
  if (!host || !port || !password) {
    return;
  }
  const pub = createClient({
    socket: { host, port: parseInt(port, 10) },
    password,
  });
  const sub = createClient({
    socket: { host, port: parseInt(port, 10) },
    password,
  });
  await pub.connect();
  await sub.connect();
  
  // Fix for boardgame.io bug: boardgame.io uses 'origins' but Socket.IO expects 'origin'
  // We override the socketOpts to provide the correct CORS configuration
  // Socket.IO v4+ requires explicit CORS configuration with all necessary options
  return new SocketIO({ 
    pubSub: new RedisPubSub(pub, sub),
    socketOpts: {
      cors: {
        origin: origins,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type'],
      }
    } as any
  });
}

const startServer = async () => {
  const configs = Promise.all(GAMES_LIST.map((gameDef) => gameDef.config()));
  const games = (await configs).map((config) => config.default.bgioGame);
  const db = getDb();
  
  // CORS configuration - allow the web app to connect
  // BGIO_PUBLIC_SERVERS contains the web app's public URL(s)
  const originsStr = process.env.BGIO_PUBLIC_SERVERS || 'http://localhost:3000';
  const origins = originsStr.split(',').map(o => o.trim());
  
  console.log('[BGIO] Configuring CORS for origins:', origins);
  
  const transport = await getTransport(origins);
  
  // Important: Due to a boardgame.io bug where it uses 'origins' instead of 'origin'
  // for Socket.IO CORS, we configure it manually via socketOpts.
  // We also need to manually add Koa CORS middleware for HTTP requests.
  // boardgame.io v0.45+ requires the origins parameter to be set explicitly
  const server = Server({ games, db, transport, origins });
  
  // Configure CORS for regular HTTP requests (Koa)
  server.app.use(cors({
    origin: (ctx) => {
      const requestOrigin = ctx.get('Origin');
      if (origins.includes(requestOrigin)) {
        return requestOrigin;
      }
      return origins[0]; // Default to first origin
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));
  
  server.app.use(noCache({ global: true }));
  
  // Add health check endpoint
  server.router.get('/healthz', (ctx) => {
    ctx.body = 'OK';
  });
  
  server.run(PORT);
};

startServer();
