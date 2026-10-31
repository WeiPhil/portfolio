import { red } from '@mui/material/colors';
import { createTheme, alpha } from '@mui/material/styles';

const primaryColor = '#B83B14';
const secondaryColor = '#475569';

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      dark: '#8F2B0C',
      light: '#D45730',
    },
    secondary: {
      main: secondaryColor,
      dark: '#1E293B',
      light: '#64748B',
    },
    text: {
      primary: '#1E293B',
      secondary: '#4B5563',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.35,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    subtitle1: {
      lineHeight: 1.7,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.65,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F3F4F6',
          color: '#1E293B',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'rgba(30, 35, 42, 0.94)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '6px 14px',
          transition: 'all 0.18s ease',
        },
        outlinedSecondary: {
          borderColor: '#D1D5DB',
          color: '#374151',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            borderColor: primaryColor,
            color: primaryColor,
            backgroundColor: alpha(primaryColor, 0.04),
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: primaryColor,
          fontWeight: 500,
          transition: 'color 0.15s ease',
          '&:hover': {
            color: '#8F2B0C',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;
