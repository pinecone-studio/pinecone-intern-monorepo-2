'use client';

import React from 'react';
import { useSignup } from '@/components/profile/SignupContext';

export const AgeInput: React.FC = () => {
  const { signupData, updateData, nextStep, prevStep } = useSignup();

  const canProceed = Boolean(signupData);

  const handleDateChange = (value: string) => {
    updateData({
     
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
       <div className="w-full max-w-md text-center">
        <div className="text-left space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <input
            type="date"
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">
            Your date of birth is used to calculate your age.
          </p>
        </div>

        <div className="flex my-5 justify-between w-full">
          <button
            onClick={prevStep}
            className=" py-1 px-3 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={` px-3 py-1 rounded-full font-semibold text-white transition-all duration-200 ${
              canProceed
                ? 'bg-[#E11D48E5] hover:opacity-80'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>  </div>
    </div>
  );
};
