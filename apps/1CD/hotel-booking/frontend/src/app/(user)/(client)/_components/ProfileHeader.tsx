'use client';

import { useAuth } from '@/components/providers';
import React from 'react';

const ProfileHeader = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="px-10 py-4 border-b-2 border-gray-200" data-cy="Update-Profile-Header">
        <div className="w-full">
          <h1 className="text-3xl font-semibold">Hi</h1>
          <p className="text-xs text-gray-400"></p>
        </div>
      </div>
    );
  }

  return (
    <div className=" md:w-2/3 w-full px-10 py-4 border-b-2 border-gray-200" data-cy="Update-Profile-Header">
      <div className="w-full">
        <h1 className="text-3xl font-semibold">Hi, {user.firstName}</h1>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
