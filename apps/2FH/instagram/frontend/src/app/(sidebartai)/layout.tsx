'use client';
import { PropsWithChildren } from 'react';
import { ApolloWrapper } from '@/components';
import { NavigationProvider } from '@/components';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <NavigationProvider>{children}</NavigationProvider>
    </ApolloWrapper>
  );
};

export default RootLayout;
