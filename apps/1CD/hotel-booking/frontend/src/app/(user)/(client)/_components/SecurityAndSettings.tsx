'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CiMail } from 'react-icons/ci';
import { IoKeyOutline } from 'react-icons/io5';
import { FaAngleRight } from 'react-icons/fa6';
import { useAuth } from '@/components/providers';

const SecurityAndSettings = () => {
  const router = useRouter();

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">Security & Settings</p>
        <p className="text-xs text-gray-400">keep your account safe with a secure password</p>
      </div>

      <div className="w-full border border-gray-200" />

      <div className="flex gap-6">
        <div className="flex items-center gap-2 p-5 border rounded-xl w-[20rem]">
          <CiMail />
          {user.email}
        </div>
        <button className="flex items-center w-[20rem] justify-between gap-2 p-5 border rounded-xl" onClick={() => router.push('/forget-password')}>
          <div className="flex items-center gap-2">
            <IoKeyOutline />
            Change password
          </div>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default SecurityAndSettings;
