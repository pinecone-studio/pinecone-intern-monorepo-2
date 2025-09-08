'use client';
import { useOtpContext } from '@/components';
import ProfileForm from '@/components/update-profile/ProfileForm';
import { useRouter } from 'next/navigation';
import React from 'react';

const ProfilePage = () => {
  const { me, loading } = useOtpContext();
  const router = useRouter();

  if (loading)
    return (
      <p data-cy="loading-profile" className="p-6 text-gray-500">
        Loading profile...
      </p>
    );
  if (me === null) {
    router.push('/login');
  }

  return (
    <div data-cy="profile-page" className="min-h-screen bg-gray-50 flex justify-center py-10">
      <ProfileForm user={me} />
    </div>
  );
};

export default ProfilePage;
