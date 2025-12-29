import { createTheme } from '@mui/material/styles';

// This theme configuration ensures MUI v6 components match the appearance
// of the production site which was built with MUI v4 defaults
export default createTheme({
  palette: {
    // Match MUI v4 default text colors (v6 has different defaults)
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // MUI v4 default black text
      secondary: 'rgba(0, 0, 0, 0.54)', // MUI v4 default secondary text
    },
    // Ensure primary color doesn't affect text rendering
    primary: {
      main: '#1976d2', // MUI v4 default primary
    },
    secondary: {
      main: '#dc004e', // MUI v4 default secondary
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Match MUI v4 behavior - use black text for outlined buttons
          '&.MuiButton-outlined': {
            color: 'rgba(0, 0, 0, 0.87)',
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Match MUI v4 default sizing - v6 has larger defaults
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 14px', // v4 default was smaller than v6's 16.5px 14px
          },
        },
        input: {
          padding: '8.5px 14px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          // Ensure consistent sizing across all input variants
          fontSize: '1rem',
        },
      },
    },
  },
  spacing: 8, // Keep MUI default spacing
  shape: {
    borderRadius: 4, // Keep MUI default border radius
  },
});
