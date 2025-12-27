import * as path from 'path';

// Use absolute path for locale files
// In Next.js, the public folder is served from the root, so we need to resolve from process.cwd()
export const localePath = typeof window === 'undefined' 
  ? path.join(process.cwd(), 'public/static/locales')
  : '/locales';
export const localeExtension = 'json';
export const defaultLanguage = 'en';
