import { LanguagePathResolver } from 'infra/navigation/types';
import { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  href: LanguagePathResolver;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
