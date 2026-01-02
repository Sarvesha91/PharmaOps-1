import { type PropsWithChildren, useMemo } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { store } from '../store';
import { useAppSelector } from '../hooks';
import { queryClient } from '../../api/queryClient';
import { buildTheme } from '../../theme';
import { selectThemeMode } from '../../features/ui/uiSlice';
import { AppProvider } from '../../context/AppContext'; // ADD THIS IMPORT

const ThemeBridge = ({ children }: PropsWithChildren) => {
  const mode = useAppSelector(selectThemeMode);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppProvider> {/* ADD THIS WRAPPER */}
        <ThemeBridge>{children}</ThemeBridge>
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProvider> {/* ADD THIS CLOSING TAG */}
    </QueryClientProvider>
  </Provider>
);