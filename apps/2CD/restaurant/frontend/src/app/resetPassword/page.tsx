'use client';

import React from 'react';
import { LucideArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen px-8 py-48">
      <button className="bg-[#441500] text-white  w-7 h-7 p-[6px] flex items-center justify-center rounded-md" onClick={() => router.push('/login')}>
        <LucideArrowLeft></LucideArrowLeft>
      </button>
      <div className="flex flex-col items-center w-full h-full gap-6">
        <h1 className="text-[24px] text-[#441500]">Нууц үг сэргээх</h1>
        <div className="flex flex-col w-full gap-2">
          <input className="w-full px-3 py-1 border rounded-md h-9" placeholder="Имэйл хаяг" />
          <button className="bg-[#441500] text-white py-2 px-3 rounded-md text-[14px]">Үргэлжлүүлэх</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
