'use client';
import { ReactNode } from 'react';
import { useNavigation } from '../NavigationProvider/NavigationProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isSearchOpen } = useNavigation();

  return (
    <main className={`transition-all duration-300 pb-16 md:pb-0 ${isSearchOpen ? 'md:ml-80' : 'md:ml-64'} flex justify-center w-full overflow-x-hidden flex-1`} data-testid="main-layout">
      {children}
    </main>
  );
};
