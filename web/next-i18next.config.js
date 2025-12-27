module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'de', 'fr', 'it'],
  },
  localePath: './public/static/locales',
  ns: ['common'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
