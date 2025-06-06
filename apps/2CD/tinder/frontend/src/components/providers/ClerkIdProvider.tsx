'use client';

import { PropsWithChildren, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ClerkIdContext } from '../syncclerkid';

export const ClerkIdProvider = ({ children }: PropsWithChildren) => {
  const [clerkId, setClerkId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (user?.id) {
        console.log('[ClerkIdProvider] Setting clerkId:', user.id);
        setClerkId(user.id);
      } else {
        console.log('[ClerkIdProvider] No user ID available');
        setClerkId(null);
      }
    }
  }, [isLoaded, user]);

  return (
    <ClerkIdContext.Provider value={{ clerkId }}>
      {children}
    </ClerkIdContext.Provider>
  );
}; 