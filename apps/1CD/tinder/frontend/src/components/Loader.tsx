'use client';

import Image from 'next/image';

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6" data-cy="logo-container">
      <div className="flex items-center gap-1">
        <Image src={'/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
        <p className="text-3xl font-semibold text-gray-600">tinder</p>
      </div>
      <div className="flex flex-col items-center justify-center h-24 gap-6">
        <div className="w-10 h-10 border-8 border-t-transparent border-[#E11D48] border-solid rounded-full animate-spin"></div>
        <div className="text-sm text-muted-foreground">Please Wait...</div>
      </div>
    </div>
  );
};
