'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ImageUpload = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[50px]">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-1" data-cy="logo-container">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>
        <div className="flex flex-col w-full h-full justify-center items-center min-h-screen gap-6">
          <div className="rounded-full w-[40px] h-[40px] border border-2 border-[#18BA51] flex justify-center items-center">
            <Check className="text-[#18BA51] w-[15px] h-[15px]" />
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-900 font-semibold" data-cy="question-title">
              You're all set!
            </p>
            <p className="text-[#71717A] text-sm text-center" data-cy="question-description">
              Your account is all set. You're ready to explore <br></br>and connect!
            </p>
          </div>
          <button onClick={handleNext} className="hover:bg-gray-800 bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="swipe-button">
            Start Swiping!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
