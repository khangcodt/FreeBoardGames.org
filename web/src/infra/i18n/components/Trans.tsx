/* eslint-disable react/prop-types */
import React, { ComponentProps } from 'react';
import { Trans as Translation } from 'react-i18next';

export const Trans = (props: ComponentProps<typeof Translation>) => {
  return <Translation {...props} style={{ whiteSpace: 'pre-line' }} />;
};
