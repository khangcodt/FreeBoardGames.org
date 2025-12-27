import { nextI18Next } from '../config';
import { WithTranslation as NextWithTranslation } from 'next-i18next';

export const withTranslation = nextI18Next.withTranslation;
export type WithTranslation = NextWithTranslation;
