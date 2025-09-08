'use client';

import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { PublicHeader } from '@/components/landing-page/PublicHeader';
import { PublicFooter } from '@/components/landing-page/PublicFooter';

export const ConditionalLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  // Check if the current path is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  // If it's an admin page, don't render public header and footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For all other pages, render with public header and footer
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
};
