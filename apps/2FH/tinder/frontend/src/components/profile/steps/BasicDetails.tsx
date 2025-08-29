'use client';

import React from 'react';
import { useSignup } from '@/components/profile/SignupContext';
import { Gender, useCreateProfileMutation } from '@/generated';


export const BasicDetails: React.FC = () => {
  const {nextStep, prevStep } = useSignup();
  const [createProfile, { loading, error }] = useCreateProfileMutation();

  const handleInputChange = () => {
    createProfile({
      variables: {
        input:{
          bio: "string",
          dateOfBirth: "string",
          gender: Gender.Male,
          images: ["string"],
          interests: ["string"],
          name: "string",
          profession: "string",
          work: "string",
          userId: "string"
        }
      },
    });
  };
  // const canProceed = Boolean(signupData.basicDetails.name);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full  bg-white">
      <div className="w-full max-w-md text-center space-y-4">
        {/* Basic Details Form */}
        <div className="text-left">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              // value={signupData.basicDetails.name || ''}
              // onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-1 border border-gray-300  rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea

              // onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest
            </label>
            <input
              type="text"

              // onChange={(e) => handleInputChange('interest', e.target.value)}
              placeholder="What are your interests?"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession
            </label>
            <input
              type="text"
              // value={signupData.basicDetails.profession || ''}
              // onChange={(e) => handleInputChange('profession', e.target.value)}
              placeholder="Enter your profession"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* School/Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School/Work
            </label>
            <input
              type="text"

              // onChange={(e) => handleInputChange('schoolWork', e.target.value)}
              placeholder="Where do you study or work?"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex my-5 justify-between w-full">
          <button
            onClick={prevStep}
            className="px-3 py-1 border border-gray-300 font-semibold rounded-full  text-gray-700 hover:opacity-70 transition-all duration-200"
          >
            Back
          </button>
          {/* <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`px-3 py-1 rounded-full text-white font-semibold transition-all duration-200 ${
              canProceed
                ? 'bg-[#E11D48E5] hover:opacity-80'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button> */}
        </div>
      </div>
    </div>
  );
};
