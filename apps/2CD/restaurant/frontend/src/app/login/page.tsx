'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const Login = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen p-8">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-[100px] h-[100px] bg-yellow-200">Logo here</div>
        <div className="flex flex-col w-full gap-6">
          <h1 className="text-[24px] text-[#441500] text-center">Нэвтрэх</h1>

          <div className="flex flex-col gap-2">
            <input className="w-full px-3 py-1 border rounded-md h-9" placeholder="Имэйл хаяг" />
            <input className="w-full px-3 py-1 border rounded-md h-9" placeholder="Нууц үг" />
            <button className="bg-[#441500] text-white py-2 px-3 rounded-md text-[14px]">Нэвтрэх</button>
            <button className="px-3 py-2 rounded-md text-[14px]" onClick={() => router.push('/resetPassword')}>
              Нууц үг мартсан?
            </button>
          </div>
          <div className="flex items-center justify-center w-full gap-2">
            <div className="w-full border border-[#71717A]"></div>
            <p className="text-[12px] text-[#71717A]">Эсвэл</p>
            <div className="w-full border border-[#71717A]"></div>
          </div>
          <button className="text-[#441500] py-2 px-4 border rounded-md text-[14px]" onClick={() => router.push('/signUp')}>
            Бүртгүүлэх
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
