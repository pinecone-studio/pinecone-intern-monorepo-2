'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ImageUpload = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/recs');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[30px]" data-cy="Image-page">
      <div className="flex flex-col items-center w-full">
        <div data-cy="register-email-header" className="flex items-center gap-1">
          <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
          <div className="text-[#424242] font-bold text-2xl">tinder</div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[700px] gap-6">
          <div className="rounded-full w-[40px] h-[40px] border border-2 border-[#18BA51] flex justify-center items-center">
            <Check className="text-[#18BA51] w-[15px] h-[15px]" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900" data-cy="question-title">
              You&apos;re all set!
            </p>
            <p className="text-[#71717A] text-sm text-center" data-cy="question-description">
              Your account is all set. You&apos;re ready to explore <br></br>and connect!
            </p>
          </div>
          <button onClick={handleNext} className="hover:bg-gray-800 bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="swipe-button">
            Start Swiping!
          </button>
        </div>
        <p className="text-[#71717A] text-sm pb-[5%]">©2024 Tinder</p>
      </div>
    </div>
  );
};

export default ImageUpload;
