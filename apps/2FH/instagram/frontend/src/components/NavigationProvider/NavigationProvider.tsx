"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isSearchOpen: boolean;
  setIsSearchOpen: (_open: boolean) => void;
  currentPage: string;
  setCurrentPage: (_page: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <NavigationContext.Provider value={{ 
      isSearchOpen, 
      setIsSearchOpen, 
      currentPage, 
      setCurrentPage 
    }}>
      {children}
    </NavigationContext.Provider>
  );
};