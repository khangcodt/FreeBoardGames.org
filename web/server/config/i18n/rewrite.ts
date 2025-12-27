import translatedPaths from 'infra/i18n/paths';
import { localeSubpaths } from './localeSubpaths';

// Note: next-i18next v15+ removed the rewrites module as Next.js now handles i18n routing natively
// Keeping the function for custom translated paths only
export function i18nRewrites() {
  const rewrites = translatedPaths.map((t) => t.rewrites).flat();
  return rewrites;
}
