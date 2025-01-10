'use client';
import React from 'react';
import ProfileHeader from '../_components/ProfileHeader';
import UpdateProfileTab from '../_components/UpdateProfile';

const Page = () => {
  return (
    <div className="flex flex-col items-center ">
      <ProfileHeader />
      <UpdateProfileTab />
    </div>
  );
};

export default Page;
