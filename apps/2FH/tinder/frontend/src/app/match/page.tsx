'use client';
import TinderSwipeDeck from '@/components/swipe/TinderInterface';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TinderPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Authentication check...</p>
        </div>
      </div>
    );
  }

  return <TinderSwipeDeck currentUserId={user.id} />;
};

export default TinderPage;