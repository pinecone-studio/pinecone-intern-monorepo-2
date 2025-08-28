'use client';
import { PropsWithChildren } from 'react';
import { ApolloWrapper, Sidebar } from '@/components';
import { NavigationProvider } from '@/components';
import { SearchSidebar } from '@/components/SearchSidebar';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { MainFooter } from '@/components/MainFooter';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <NavigationProvider>
        <MainLayout>
          <Sidebar />
          <SearchSidebar />
          <div className="flex min-h-screen bg-white flex-col w-[calc(100%-256px)]  ml-64">
            <div className="flex items-center justify-center">{children}</div>
          </div>
        </MainLayout>

        <MainFooter />
      </NavigationProvider>
    </ApolloWrapper>
  );
};

export default RootLayout;
