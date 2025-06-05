'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const ClerkIdSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.id) {
      localStorage.setItem('clerkID', user.id);
      console.log('[ClerkIdSync] clerkID set in localStorage:', user.id);
    }
  }, [isLoaded, user]);

  return null; 
};
