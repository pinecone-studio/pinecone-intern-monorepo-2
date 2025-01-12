'use client';

import { PropsWithChildren, useMemo } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// const theme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#1ED760',
//     },
//   },
// });

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#1ED760',
          },
        },
      }),
    []
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
