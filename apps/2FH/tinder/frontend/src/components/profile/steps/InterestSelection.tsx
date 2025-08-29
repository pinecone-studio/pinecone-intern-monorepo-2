'use client';

import React, { useState } from 'react';
import { useSignup } from '@/components/profile/SignupContext';

export const InterestSelection: React.FC = () => {
  const { signupData, updateData, nextStep } = useSignup();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const interests = ['Men', 'Women', 'Both', 'Queer'];

  const handleInterestSelect = (interest: string) => {
    updateData({ interest });
    setIsDropdownOpen(false);
  };

  const canProceed = signupData.interest.length > 0;

  return (
    <div className="flex flex-col bg-white items-center h-full">
    <div className="w-full max-w-md text-center space-y-4">
      {/* Interest Dropdown */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={signupData.interest}
            onChange={(e) => updateData({ interest: e.target.value })}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Select"
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer text-gray-700"
            readOnly
          />
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
  
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestSelect(interest)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {interest}
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Next Button */}
      <div className='flex justify-end'>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`ml-auto px-3 py-1 rounded-full font-semibold text-white bg-[#E11D48E5] hover:opacity-50 ${
            canProceed
              ? "bg-pink-500 hover:bg-red-500"
              : "bg-gray-300 cursor-not-allowed opacity-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  
    {/* Footer */}
    <div className="absolute bottom-4 text-gray-400 text-sm">©2024 Tinder</div>
  </div>
  
  );
}; 