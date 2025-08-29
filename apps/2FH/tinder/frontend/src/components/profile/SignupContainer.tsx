'use client';

import React from 'react';
import { useSignup } from '@/components/profile/SignupContext';
import { InterestSelection } from '@/components/profile/steps/InterestSelection';
import { AgeInput } from '@/components/profile/steps/AgeInput';
import { BasicDetails } from '@/components/profile/steps/BasicDetails';
import { ImageUpload } from '@/components/profile/steps/ImageUpload';
import { Completion } from '@/components/profile/steps/Completion';
import { ProgressBar } from '@/components/profile/steps/ProgressBar';

export const SignupContainer: React.FC = () => {
  const { currentStep, signupData } = useSignup();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <InterestSelection />;
      case 1:
        return <AgeInput />;
      case 2:
        return <BasicDetails />;
      case 3:
        return <ImageUpload />;
      case 4:
        return <Completion />;
      default:
        return <InterestSelection />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Who are you interested in?";
      case 1:
        return "How old are you?";
      case 2:
        return "Your basic details";
      case 3:
        return "Upload your image";
      case 4:
        return "You're all set!";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 0:
        return "Pick the one that feels right for you!";
      case 1:
        return "Please enter your age to continue.";
      case 2:
        return "Please provide the following information to help us get to know you better.";
      case 3:
        return "Please choose an image that represents you.";
      case 4:
        return "Your account is all set. You're ready to explore and connect!";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
        <div className="text-center w-[500px]">
          <h1 className="text-3xl font-bold m-10 ">🔥 tinder</h1>

        {/* Step Title and Subtitle */}
        {currentStep < 4 && (
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
        <ProgressBar currentStep={currentStep} totalSteps={5} />
      </div>
      <div className="absolute bottom-4 text-gray-400 text-sm">©2024 Tinder</div>
    </div>
  );
}; 