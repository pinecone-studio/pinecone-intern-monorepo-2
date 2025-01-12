// app/(main)/not-found.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the leaveCalendar page after component mounts
    router.push('/leaveCalendar');
  }, [router]);

  return null; // Return null because we don't need to render anything
};

export default NotFound;
