'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Sidebar, SearchSidebar } from '@/components';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { MainFooter } from '@/components/MainFooter';

const PUBLIC_ROUTES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'];

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For public routes or unauthenticated users, show minimal layout
  if (isPublicRoute || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  // For authenticated users on protected routes, show full layout
  return (
    <div className="flex min-h-screen bg-white flex-col">
      <Sidebar />
      <SearchSidebar />
      <div className="flex flex-col items-center">
        <MainLayout>{children}</MainLayout>
        <MainFooter />
      </div>
    </div>
  );
};
