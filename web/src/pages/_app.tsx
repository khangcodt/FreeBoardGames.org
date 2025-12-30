/* eslint-disable react/react-in-jsx-scope */

import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import { CacheProvider, EmotionCache } from '@emotion/react';
import * as Sentry from '@sentry/browser';
import { ThemeProvider } from 'infra/common';
import { SelfXSSWarning } from 'infra/common/components/base/SelfXSSWarning';
import AddressHelper from 'infra/common/helpers/AddressHelper';
import { GameProvider } from 'infra/game/GameProvider';
import { wrapper } from 'infra/common/redux/store';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import createEmotionCache from 'infra/common/components/theme/createEmotionCache';

const SENTRY_DSN = 'https://5957292e58cf4d2fbb781910e7b26b1f@o397015.ingest.sentry.io/5251165';

const httpLink = createHttpLink({
  uri: AddressHelper.getGraphQLServerAddress(),
});

// Add authentication to HTTP requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('fbgUserToken2') : null;
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'CSRF-Token': typeof window !== 'undefined' ? Cookies.get('XSRF-TOKEN') : '',
    }
  }
});

const isMainDomain =
  typeof window !== 'undefined' && window.location.hostname.toLowerCase() === 'www.freeboardgames.org';

// Global error handler to clear auth tokens on 401 errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      const status = (error?.extensions?.exception as any)?.status;
      if (status === 401) {
        // Clear invalid tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('fbgUserToken2');
          localStorage.removeItem('fbgNickname2');
          console.log('Authentication expired. Please enter your nickname again.');
        }
      }
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// SSR makes this error - use the NEW graphql-ws protocol
const wsLink = process.browser
  ? new GraphQLWsLink(
      createClient({
        url: AddressHelper.getWSServerAddress(),
        connectionParams: () => {
          const token = localStorage.getItem('fbgUserToken2');
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
      })
    )
  : undefined;

const link = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      errorLink.concat(authLink.concat(httpLink)),
    )
  : errorLink.concat(authLink.concat(httpLink));

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps {
  emotionCache?: EmotionCache;
  pageProps: any;
  Component: any;
}

function DefaultApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  
  React.useEffect(() => {
    // Remove the server-side injected CSS (emotion styles):
    const emotionStyles = document.querySelector('[data-emotion]');
    if (emotionStyles?.parentElement) {
      // Emotion handles cleanup automatically, but we can still check
    }

    // Initialize Google Analytics:
    if (isMainDomain) {
      const version = process.env.VERSION;
      const channel = process.env.CHANNEL;
      let release;
      if (version && channel) release = `${version}-${channel}`;
      Sentry.init({ dsn: SENTRY_DSN, release });
    }
  }, []);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="FreeBoardGames.org" />
          <meta name="apple-mobile-web-app-title" content="FreeBoardGames.org" />
          <meta name="theme-color" content="#3f51b5" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="msapplication-config" content="/static/icons/browserconfig.xml" />
        </Head>
        <ThemeProvider>
          <SelfXSSWarning />
          <ApolloProvider client={client}>
            <GameProvider {...props}>
              <Component {...props} />
            </GameProvider>
          </ApolloProvider>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default appWithTranslation(DefaultApp);
