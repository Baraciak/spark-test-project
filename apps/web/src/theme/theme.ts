'use client';

import { createTheme, alpha } from '@mui/material/styles';

const GLASS = {
  bg: 'rgba(255, 255, 255, 0.04)',
  bgHover: 'rgba(255, 255, 255, 0.08)',
  bgActive: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.15)',
  blur: 'blur(24px)',
  blurHeavy: 'blur(40px)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  shadowElevated: '0 16px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8',
      light: '#a5b4fc',
      dark: '#6366f1',
    },
    secondary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#06b6d4',
    },
    background: {
      default: '#050510',
      paper: GLASS.bg,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.92)',
      secondary: 'rgba(255, 255, 255, 0.55)',
    },
    divider: GLASS.border,
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundAttachment: 'fixed',
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
          background: 'rgba(5, 5, 16, 0.6)',
          backdropFilter: GLASS.blurHeavy,
          WebkitBackdropFilter: GLASS.blurHeavy,
          borderBottom: `1px solid ${GLASS.border}`,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
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
            background: 'rgba(255, 255, 255, 0.03)',
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
              background: 'rgba(255, 255, 255, 0.06)',
              '& fieldset': {
                borderColor: alpha('#818cf8', 0.5),
                borderWidth: 1,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.4)',
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
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #06b6d4 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c7ff7 0%, #9ba3fc 50%, #22d3ee 100%)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
          color: 'rgba(255, 255, 255, 0.25)',
          transition: 'all 0.2s ease',
          '&.Mui-checked': {
            color: '#818cf8',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(15, 15, 30, 0.9)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${GLASS.border}`,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
