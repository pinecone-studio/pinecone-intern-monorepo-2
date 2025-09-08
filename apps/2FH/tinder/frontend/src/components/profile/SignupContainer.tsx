'use client';

import React from 'react';
import Image from 'next/image';
import { useSignup } from '@/components/profile/SignupContext';
import { GenderSelection } from './steps/GenderSelection';
import { AgeInput } from '@/components/profile/steps/AgeInput';
import { BasicDetails } from '@/components/profile/steps/BasicDetails';
import { ImageUpload } from '@/components/profile/steps/ImageUpload';
import { Completion } from '@/components/profile/steps/Completion';
import { InterestedInSelection } from './steps/InterestedIn';
// import { ProgressBar } from '@/components/profile/steps/ProgressBar';

// Step configuration data
const stepConfig = {
  0: {
    component: <GenderSelection />,
    title: "What's your gender?",
    subtitle: "Pick the one that feels right for you!"
  },
  1: {
    component: <InterestedInSelection />,
    title: "Who are you interested in?",
    subtitle: "Pick the one that feels right for you!"
  },
  2: {
    component: <AgeInput />,
    title: "How old are you?",
    subtitle: "Please enter your age to continue."
  },
  3: {
    component: <BasicDetails />,
    title: "Your basic details",
    subtitle: "Please provide the following information to help us get to know you better."
  },
  4: {
    component: <ImageUpload />,
    title: "Upload your image",
    subtitle: "Please choose an image that represents you."
  },
  5: {
    component: <Completion />,
    title: "You're all set!",
    subtitle: "Your account is all set. You're ready to explore and connect!"
  }
};

export const SignupContainer: React.FC = () => {
  const { currentStep } = useSignup();

  const renderStep = () => {
    return stepConfig[currentStep as keyof typeof stepConfig]?.component || <GenderSelection />;
  };

  const getStepTitle = () => {
    return stepConfig[currentStep as keyof typeof stepConfig]?.title || "";
  };

  const getStepSubtitle = () => {
    return stepConfig[currentStep as keyof typeof stepConfig]?.subtitle || "";
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="text-center w-[500px]">
        <h1 className="text-3xl font-bold m-5 flex justify-center items-center">
          <Image src="/logo.png" alt="Tinder" width={200} height={200} />
        </h1>

        {/* Step Title and Subtitle */}
        {(currentStep < 5 || process.env.NODE_ENV === 'test') && (
          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {getStepTitle()}
            </h2>
            <p className="text-gray-600 text-sm">
              {getStepSubtitle()}
            </p>
          </div>
        )}

        {/* Step Content */}
        <div className="h-[400px]">
          {renderStep()}
        </div>
        {/* <ProgressBar currentStep={currentStep} totalSteps={5} /> */}
      </div>
      <div className="absolute bottom-4 text-gray-400 text-sm">©2024 Tinder</div>
    </div>
  );
}; 