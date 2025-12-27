import { useTranslation as useTranslationBase, withTranslation as withTranslationBase, appWithTranslation as appWithTranslationBase, serverSideTranslations } from 'next-i18next';
import { i18n, localeSubpaths } from 'server/config/i18n';
import { localePath } from './constants';
import { namespace } from './utils/ns';

export type INextI18Next = typeof nextI18Next;

// Simple wrapper for next-i18next v15 compatibility
export const nextI18Next = {
  useTranslation: useTranslationBase,
  withTranslation: withTranslationBase,
  appWithTranslation: appWithTranslationBase,
  serverSideTranslations: serverSideTranslations,
  i18n: i18n,
  config: { i18n, localePath, ns: namespace },
};

// Export serverSideTranslations for convenience
export { serverSideTranslations };



if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  // @ts-ignore
  window.nextI18Next = nextI18Next;
}
