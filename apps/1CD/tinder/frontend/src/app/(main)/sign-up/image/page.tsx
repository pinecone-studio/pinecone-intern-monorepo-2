'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ImageUpload = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-1  mt-[78px]" data-cy="logo-container">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>

        <p className="text-2xl text-gray-900 font-semibold mt-[30px]" data-cy="question-title">
          Upload your image
        </p>
        <p className="text-[#71717A] text-sm" data-cy="question-description">
          Please choose an image that represents you
        </p>
        <div className="grid grid-rows-2 grid-cols-3 gap-6 mt-[24px]">
          <div
            className="h-[296px] aspect-[2/3] bg-gray-400 rounded-md flex justify-end p-2
          "
            data-cy="image-placeholder"
          >
            <button className="w-9 h-9 bg-white border border-[#E4E4E7] rounded-md flex justify-center items-center hover:bg-gray-100" data-cy="remove-button">
              <X className="w-4" />
            </button>
          </div>
        </div>
        <button className="rounded-full border border-1 border-[#E11D48] flex gap-2 w-[640px] justify-center py-2 mt-2 items-center hover:bg-gray-100" data-cy="upload-image-button">
          <p className="text-[#E11D48] text-xl font-thin">+</p>
          <p className="text-sm">Upload image</p>
        </button>
        <div className="flex justify-between w-[640px] mt-2" data-cy="navigation-buttons">
          <button type="button" onClick={handleBack} className="hover:bg-gray-100 border border-1 rounded-full px-4 py-2" data-cy="back-button">
            Back
          </button>
          <button type="button" onClick={handleNext} className="hover:bg-gray-800 bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="next-button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
