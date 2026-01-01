// Updated for MUI v6 with Emotion
// https://mui.com/material-ui/integrations/nextjs/

import * as React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import getConfig from 'next/config';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../infra/common/components/theme/createEmotionCache';

interface MyDocumentProps extends DocumentInitialProps {
  emotionStyleTags: JSX.Element[];
  runtimeConfig: {
    apiUrl: string;
    wsUrl: string;
  };
}

export default class MyDocument extends Document<MyDocumentProps> {
  render() {
    // Runtime config is passed via props from getInitialProps
    // This ensures it's evaluated at REQUEST TIME on the server, not at build time
    const { runtimeConfig } = this.props;

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

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<MyDocumentProps> => {
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

  // Get runtime config - this is evaluated at REQUEST TIME on the server
  // publicRuntimeConfig is set in next.config.ts and reads environment variables
  // when the server handles each request, not during the Docker build
  const { publicRuntimeConfig } = getConfig();
  const runtimeConfig = {
    apiUrl: publicRuntimeConfig.FBG_API_URL,
    wsUrl: publicRuntimeConfig.FBG_WS_URL,
  };

  return {
    ...initialProps,
    emotionStyleTags,
    runtimeConfig,
  };
};
