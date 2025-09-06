'use client';

import { SignupProvider, SignupContainer } from '@/components/profile';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get userId from localStorage (set during user creation)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // No userId found, redirect to signup
      console.log('No userId found, redirecting to signup');
      router.push('/signup');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to signup...</p>
        </div>
      </div>
    );
  }

  return (
    <SignupProvider userId={userId}>
      <SignupContainer />
    </SignupProvider>
  );
};

Page.displayName = 'Page';

export default Page;
