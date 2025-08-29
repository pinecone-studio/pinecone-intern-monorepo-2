'use client';

import React from 'react';
import { useSignup } from '@/components/profile/SignupContext';

export const Completion: React.FC = () => {
  const { signupData, goToStep } = useSignup();

  const handleStartSwiping = () => {
    // In a real app, this would navigate to the main app
    alert('Welcome to Tinder! Start swiping to find your match!');
  };

  const handleEditProfile = () => {
    goToStep(0); // Go back to first step to edit
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">
          You're all set!
        </h3>
        <p className="text-gray-600">
          Your account is all set. Start swiping to find your match!
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className='w-full'>
        <button
          onClick={handleStartSwiping}
          className="py-2 px-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-full transition-all duration-200 transform hover:scale-105"
          >
          Start Swiping
        </button>
          </div>

          {/* <div className='w-full'>
        <button
          onClick={handleEditProfile}
          className="py-2 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
          Edit Profile
        </button>
          </div> */}
      </div>
    </div>
  );
}; 