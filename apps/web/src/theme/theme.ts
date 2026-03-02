'use client';

import { createTheme } from '@mui/material/styles';

const GLASS = {
  bg: 'rgba(255, 255, 255, 0.72)',
  bgHover: 'rgba(255, 255, 255, 0.82)',
  bgActive: 'rgba(255, 255, 255, 0.88)',
  border: 'rgba(0, 0, 0, 0.06)',
  borderHover: 'rgba(0, 0, 0, 0.1)',
  blur: 'blur(20px)',
  blurHeavy: 'blur(40px)',
  shadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  shadowElevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#409CFF',
      dark: '#0056CC',
    },
    secondary: {
      main: '#34C759',
      light: '#6DD98E',
      dark: '#248A3D',
    },
    background: {
      default: '#F2F2F7',
      paper: GLASS.bg,
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.55)',
    },
    divider: GLASS.border,
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F2F2F7',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: GLASS.bg,
          backdropFilter: GLASS.blur,
          WebkitBackdropFilter: GLASS.blur,
          border: `1px solid ${GLASS.border}`,
          boxShadow: GLASS.shadow,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(242, 242, 247, 0.72)',
          backdropFilter: GLASS.blurHeavy,
          WebkitBackdropFilter: GLASS.blurHeavy,
          borderBottom: `1px solid ${GLASS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: GLASS.bg,
          backdropFilter: GLASS.blur,
          WebkitBackdropFilter: GLASS.blur,
          border: `1px solid ${GLASS.border}`,
          boxShadow: GLASS.shadow,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: GLASS.bgHover,
            borderColor: GLASS.borderHover,
            boxShadow: GLASS.shadowElevated,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(0, 0, 0, 0.03)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            transition: 'all 0.25s ease',
            '& fieldset': {
              borderColor: GLASS.border,
              transition: 'border-color 0.25s ease',
            },
            '&:hover fieldset': {
              borderColor: GLASS.borderHover,
            },
            '&.Mui-focused': {
              background: 'rgba(0, 0, 0, 0.02)',
              '& fieldset': {
                borderColor: '#007AFF',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: '#007AFF',
          boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)',
          '&:hover': {
            background: '#0056CC',
            boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderColor: GLASS.border,
          background: GLASS.bg,
          backdropFilter: 'blur(12px)',
          '&:hover': {
            borderColor: GLASS.borderHover,
            background: GLASS.bgHover,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          '&.Mui-checked': {
            color: '#007AFF',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(16px)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          borderRadius: 8,
          color: '#fff',
        },
      },
    },
  },
});

export default theme;
