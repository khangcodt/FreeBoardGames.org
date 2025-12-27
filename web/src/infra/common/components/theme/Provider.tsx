/* eslint-disable react/prop-types */
import { ThemeProvider as UIThemeProvider } from '@mui/material/styles';
import theme from 'infra/common/components/base/theme';
import React from 'react';

export function ThemeProvider({ children }) {
  return <UIThemeProvider theme={theme}>{children}</UIThemeProvider>;
}
