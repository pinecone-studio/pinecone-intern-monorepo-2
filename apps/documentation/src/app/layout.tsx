'use client';

import './global.css';
import { PropsWithChildren } from 'react';
import { Drawer, Header, ThemeProvider } from '../components';
import { Stack, Container, Toolbar } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <Header />

            <Stack direction="row">
              <Drawer />

              <Stack flex={1}>
                <Toolbar />

                <Container maxWidth="md">
                  <Stack py={6}>{children}</Stack>
                </Container>
              </Stack>
            </Stack>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
