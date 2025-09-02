'use client';

import React, { useState } from 'react';
import { useSignup } from '@/components/profile/SignupContext';
import { validateField } from '@/utils/profile-validation';

// Helper function to handle date validation
const handleDateValidation = (value: string, setError: (_error: string) => void, handleInputChange: (_data: { dateOfBirth: string }) => void) => {
  const validation = validateField('dateOfBirth', value);
  setError(validation.success ? '' : (validation.error || 'Алдаа'));
  handleInputChange({ dateOfBirth: value });
};

// Helper function to create date change handler
const createDateChangeHandler = (setError: React.Dispatch<React.SetStateAction<string>>, handleInputChange: (_data: { dateOfBirth: string }) => void) => {
  return (value: string) => {
    handleDateValidation(value, setError, handleInputChange);
  };
};

// Helper function to get component state
const getComponentState = (signupData: any, error: string) => {
  return {
    canProceed: Boolean(signupData.dateOfBirth) && !error,
    handleDateChange: createDateChangeHandler
  };
};

export const AgeInput: React.FC = () => {
  const { signupData, handleInputChange, nextStep, prevStep } = useSignup();
  const [error, setError] = useState<string>('');

  const { canProceed, handleDateChange } = getComponentState(signupData, error);
  const dateChangeHandler = handleDateChange(setError, handleInputChange);

  return (
    <div className="flex flex-col items-center  bg-white h-full">
      <div className="w-full max-w-md text-center">
        <div className="text-left ">
          <label className="text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <input
            type="date"
            value={signupData.dateOfBirth || ''} // ✅ context-с авна
            onChange={(e) => dateChangeHandler(e.target.value)} // ✅ validation-тай
            className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
          <p className="text-xs text-gray-500">
            Your date of birth is used to calculate your age.
          </p>
        </div>

        <div className="flex my-5 justify-between w-full">
          <button
            onClick={prevStep}
            className="py-1 px-3 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`px-3 py-1 rounded-full font-semibold text-white transition-all duration-200 ${canProceed
              ? 'bg-[#E11D48E5] hover:opacity-80'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
