import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper, NavigationProvider } from '@/components';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { Sidebar, MobileBottomNav } from '@/components';
import { MainFooter } from '@/components/MainFooter';

export const metadata = {
  title: 'Instagram Clone',
  description: 'A responsive Instagram clone built with Next.js',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-white flex flex-col">
        <ApolloWrapper>
          <NavigationProvider>
            <AuthProvider>
              <div className="flex flex-1 w-full">
                <aside className="hidden md:block sticky top-0 h-screen">
                  <Sidebar />
                </aside>

                <main className="flex flex-1 w-full">
                  <MainLayout>{children}</MainLayout>
                </main>

                <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white">
                  <MobileBottomNav />
                </div>
              </div>
            </AuthProvider>
          </NavigationProvider>
        </ApolloWrapper>

        <div className="hidden md:block">
          <MainFooter />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
