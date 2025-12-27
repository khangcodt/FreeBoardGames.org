import createCache from '@emotion/cache';

// Create emotion cache for client-side styling
// prepend: true moves MUI styles to the top of the <head> so they're loaded first
// This allows developers to easily override MUI styles with other styling solutions, like CSS modules
export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
