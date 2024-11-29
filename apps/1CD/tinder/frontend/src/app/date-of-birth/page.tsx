'use client';

import { CalendarForm } from '../../components/user/input';
import Image from 'next/image';
import logo from '../img/logo.svg';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const dateOfBirth = () => {
  const router = useRouter();
  const [dob, setDob] = useState<string>('');

  const handleNext = () => {
    if (!dob) {
      alert('Please select a date!');
      return;
    }
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[200px]">
      <div className="flex flex-col items-center w-full gap-6">
        <div className="flex items-center gap-1">
          <Image src={logo} alt="Tinder logo" width={20.28} height={24.02} className="w-[20.28px] h-[24.02px]" />
          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>
        <div>
          <p className="text-2xl text-gray-900 font-semibold">How old are you</p>
          <p className="text-[#71717A] text-sm">Please enter your age to continue</p>
        </div>
        <CalendarForm setDob={setDob} />
        <div className="flex justify-between w-[294px]">
          <button onClick={handleBack} className="hover:bg-gray-300 border border-1 rounded-full px-4 py-2">
            Back
          </button>
          <button onClick={handleNext} className="hover:bg-[#E11D48] border border-1 rounded-full px-4 py-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default dateOfBirth;
