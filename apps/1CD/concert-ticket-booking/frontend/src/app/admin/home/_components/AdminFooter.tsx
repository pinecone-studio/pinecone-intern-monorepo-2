'use client';

import { useAuth } from '@/components/providers';

export const AdminFooter = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <div></div>;
  }
  return (
    <div data-cy="Admin-Footer" className="text-center bg-white ">
      ©2024 Copyright
    </div>
  );
};
