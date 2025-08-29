'use client';

import { PropsWithChildren } from 'react';
import { ApolloWrapper, NavigationProvider } from '@/components';
import { MainLayout } from '@/components/MainLayout/MainLayout';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <ApolloWrapper>
        <NavigationProvider>
          <MainLayout>{children}</MainLayout>
        </NavigationProvider>
      </ApolloWrapper>
    </div>
  );
};

export default RootLayout;
