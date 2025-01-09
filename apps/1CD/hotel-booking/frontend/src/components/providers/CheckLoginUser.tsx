'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { ReactNode, useEffect } from 'react';

const CheckLoginUser = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user?.email) return;
      router.push('/login');
    }
  }, [user]);

  return <div>{children}</div>;
};

export default CheckLoginUser;
