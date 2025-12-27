/* eslint-disable react/prop-types */
import { ButtonBase, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WarningIcon from '@mui/icons-material/Warning';
import React, { HTMLAttributes } from 'react';

export const Heading = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Floating
      {...props}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gridGap: '8px',
        top: '12px',
        left: '8px',
      }}
    >
      {children}
    </Floating>
  );
};

export const Title = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Panel
      {...props}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gridGap: '8px',
        top: '12px',
        left: '8px',
        padding: '0px 8px',
        paddingTop: '4px',
      }}
    >
      <Typography gutterBottom={false} variant="h4" component="h2" style={{ fontWeight: 300 }}>
        {children}
      </Typography>
    </Panel>
  );
};

export const Warning = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return (
    <ButtonBase
      sx={{
        alignItems: 'center',
        height: '100%',
        borderRadius: '8px',
        minHeight: '42px',
      }}
    >
      <Panel
        {...props}
        ref={ref}
        sx={{
          flexShrink: '0',
          height: '100%',
          minHeight: '45px',
          minWidth: '45px',
        }}
      >
        <WarningIcon
          sx={{
            width: '32px',
            height: '100%',
            padding: '0 4px',
            color: 'warning.main',
          }}
        />
      </Panel>
    </ButtonBase>
  );
});

export const Description = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Floating
      {...props}
      sx={{
        bottom: '12px',
        left: '8px',
      }}
    >
      <Panel
        sx={{
          padding: '0px 8px',
        }}
      >
        <Typography gutterBottom={false} variant="overline" component="h5">
          {children}
        </Typography>
      </Panel>
    </Floating>
  );
};

export const NavigateButton = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Floating
      {...props}
      sx={{
        bottom: '12px',
        right: '8px',
        padding: '0',
      }}
    >
      <Panel
        sx={{
          borderRadius: '32px',
        }}
      >
        <IconButton aria-label="Next">
          <NavigateNextIcon />
        </IconButton>
      </Panel>
    </Floating>
  );
};

export const Panel = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { sx?: any }>(
  ({ sx, ...props }, ref) => {
    return (
      <Box
        {...props}
        ref={ref}
        sx={{
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          borderRadius: '8px',
          backgroundColor: 'white',
          ...sx,
        }}
      />
    );
  },
);

export const Floating = ({ sx, ...props }: HTMLAttributes<HTMLDivElement> & { sx?: any }) => {
  return (
    <Box
      {...props}
      sx={{
        position: 'absolute',
        ...sx,
      }}
    />
  );
};
