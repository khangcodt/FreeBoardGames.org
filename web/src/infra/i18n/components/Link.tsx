/* eslint-disable react/prop-types */
import React, { FC } from 'react';
import NextLink from 'next/link';
import { nextI18Next } from '../config';
import { Language, LinkProps } from '../types';

export const Link: FC<LinkProps> = ({ href, className, style, ...props }) => {
  const { i18n } = nextI18Next.useTranslation();
  return <NextLink href={href(i18n.language as Language)} locale={i18n.language} className={className} style={style} {...props} />;
};
