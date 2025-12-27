const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'de', 'fr', 'it'],
  },
  localePath: path.join(process.cwd(), 'public/static/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
