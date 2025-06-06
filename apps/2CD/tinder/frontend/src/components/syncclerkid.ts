'use client';

import { createContext } from 'react';
import { useUser } from '@clerk/nextjs';

interface ClerkIdContextType {
  clerkId: string | null;
}

export const ClerkIdContext = createContext<ClerkIdContextType>({ clerkId: null });

export const useClerkId = () => {
  const { user, isLoaded } = useUser();
  const clerkId = isLoaded && user ? user.id : null;
  return { clerkId };
};

export const useGetClerkId = (): string | null => {
  const { clerkId } = useClerkId();
  return clerkId;
}; 