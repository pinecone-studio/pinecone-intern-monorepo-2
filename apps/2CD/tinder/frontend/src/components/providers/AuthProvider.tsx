
'use client';


import Login from '@/app/(auth)/login/page';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { PropsWithChildren } from 'react';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Login />
      </SignedOut>
    </ClerkProvider>
  );
};