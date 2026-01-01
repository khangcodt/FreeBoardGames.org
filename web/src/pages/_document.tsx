// Updated for MUI v6 with Emotion
// https://mui.com/material-ui/integrations/nextjs/

import * as React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../infra/common/components/theme/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    // Inject runtime configuration from server-side environment variables
    // This makes them available to the client without being baked into the build
    const runtimeConfig = {
      // FBG_API_URL is the public URL for client-side connections
      // In Coolify, this will be set to SERVICE_URL_FBG_SERVER at runtime
      // NOTE: We use FBG_API_URL (not NEXT_PUBLIC_*) because NEXT_PUBLIC_* vars
      // are inlined at build time and cannot be changed at runtime
      apiUrl: process.env.FBG_API_URL || process.env.FBG_BACKEND_TARGET || 'http://localhost:3001',
    };

    return (
      <Html lang="en">
        <Head>
          {/* Inject runtime configuration before any other scripts */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__RUNTIME_CONFIG__ = ${JSON.stringify(runtimeConfig)};`,
            }}
          />
          <link rel="shortcut icon" type="image/x-icon" href="/static/icons/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/icons/favicon.ico" />
          {/* Inject MUI styles first to match with the prepend: true option. */}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps & { emotionStyleTags: JSX.Element[] }> => {
  const originalRenderPage = ctx.renderPage;

  // Create emotion cache for SSR
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  
  // This is important. It prevents Emotion from rendering invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
