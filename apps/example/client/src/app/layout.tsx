import './global.css';

import { ApolloWrapper } from '../components';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="mn">
      <body>
        <AppRouterCacheProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
          <CssBaseline />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
