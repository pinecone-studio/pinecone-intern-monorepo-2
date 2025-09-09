'use client';
import { useOtpContext } from '@/components';
import { HotelLoader } from '@/components/loadingComponent/Loader';
import ProfileForm from '@/components/update-profile/ProfileForm';
import { useRouter } from 'next/navigation';
import React from 'react';

const ProfilePage = () => {
  const { me, loading } = useOtpContext();
  const router = useRouter();

  if (loading)
    return (
      <div className="mt-10">
        <HotelLoader />
      </div>
    );
  if (me === null) {
    router.push('/login');
  }

  return (
    <div data-cy="profile-page" className="h-fit bg-gray-50 flex justify-center py-10">
      <ProfileForm user={me} />
    </div>
  );
};

export default ProfilePage;
