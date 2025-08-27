"use client"
import { ReactNode } from 'react';
import { useNavigation } from '../NavigationProvider/NavigationProvider'; 

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isSearchOpen } = useNavigation();

  return (
    <main className={`flex-1 transition-all duration-300 ${
      isSearchOpen ? 'ml-[400px]' : 'ml-64'
    }`}>
      {children}
    </main>
  );
};