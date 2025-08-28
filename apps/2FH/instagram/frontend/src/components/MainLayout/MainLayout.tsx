'use client';
import { ReactNode } from 'react';
import { useNavigation } from '../NavigationProvider/NavigationProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isSearchOpen } = useNavigation();

  return (
    <main className={`transition-all duration-300 ${isSearchOpen ? 'ml-0 ' : 'ml-0 '}`} data-testid="main-layout">
      {children}
    </main>
  );
};
