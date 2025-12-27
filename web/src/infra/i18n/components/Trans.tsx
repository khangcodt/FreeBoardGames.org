/* eslint-disable react/prop-types */
import { makeStyles } from '@mui/styles';
import React, { ComponentProps } from 'react';
import { Trans as Translation } from 'react-i18next';

const useStyleClasses = makeStyles({
  text: {
    whiteSpace: 'pre-line',
  },
});

export const Trans = (props: ComponentProps<typeof Translation>) => {
  const classes = useStyleClasses();
  return (
    <span className={classes.text}>
      <Translation {...props} />
    </span>
  );
};
