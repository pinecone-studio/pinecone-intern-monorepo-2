import { PropsWithChildren } from 'react';
import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Drawer, Header, ThemeProvider } from '../components';
import { Stack, Container, Toolbar } from '@mui/material';

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
                  <Stack py={2}>{children}</Stack>
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
