import { cd, checkGameExists } from "../util.js";
import fs from "fs";
import path from "path";

export function genGames(games = []) {
  cd("web/src/games");
  games.forEach((g) => checkGameExists(g));
  const finalGames = orderGames(games.length > 0 ? games : getAllGames());
  const fileContent = genFileContent(finalGames);
  writeFile(fileContent);
}

function orderGames(games) {
  const configContent = fs.readFileSync("config.json", "utf8");
  const config = JSON.parse(configContent);
  const order = config.order;
  const result = [...games].sort((a, b) => {
    let aIndex = order.indexOf(a);
    let bIndex = order.indexOf(b);
    if (aIndex === -1) {
      aIndex = 9999;
    }
    if (bIndex === -1) {
      bIndex = 9999;
    }
    return aIndex - bIndex;
  });
  return result;
}

function getAllGames() {
  return fs.readdirSync(process.cwd(), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function genFileContent(games) {
  let importGen = [];
  let mapGen = [];
  let listGen = [];

  for (const game of games) {
    importGen.push(`import ${game} from './${game}';`);
    mapGen.push(`  ${game},`);
    listGen.push(`  GAMES_MAP.${game},`);
  }

  const result = `/** AUTO-GENERATED FILE, DO NOT EDIT MANUALLY. */
import { IGameDef, IGameDefMap } from 'gamesShared/definitions/game';
${importGen.join("\n")}

export const GAMES_MAP: IGameDefMap = {
${mapGen.join("\n")}
};

export const GAMES_LIST: IGameDef[] = [
${listGen.join("\n")}
];
`;
  return result;
}

function writeFile(fileContent) {
  const filePath = path.resolve(process.cwd(), "index.ts");
  fs.writeFileSync(filePath, fileContent);
}
