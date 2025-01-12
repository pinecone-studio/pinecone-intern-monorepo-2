'use client';

import { PropsWithChildren, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme as themeOptions } from '../../theme';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useMemo(() => {
    return createTheme(themeOptions);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
