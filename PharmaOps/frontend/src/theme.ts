import { createTheme } from '@mui/material/styles';

import type { PaletteMode } from '@mui/material';

const typography = {
  fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

export const buildTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#006D77',
      },
      secondary: {
        main: '#FFB703',
      },
      background: {
        default: mode === 'light' ? '#f4f6fb' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1f2937',
      },
    },
    typography,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

