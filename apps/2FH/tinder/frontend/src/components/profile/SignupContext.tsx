'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SignupData {
  interest: string;
  age: {
    day: string;
    month: string;
    year: string;
  };
  basicDetails: {
    name: string;
    sex: string;
    interested: string;
    profession: string;
    education: string;
    relationshipStatus: string;
  };
  images: string[];
}

interface SignupContextType {
  currentStep: number;
  signupData: SignupData;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (data: Partial<SignupData>) => void;
  isComplete: boolean;
}

export const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

interface SignupProviderProps {
  children: ReactNode;
}

export const SignupProvider: React.FC<SignupProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signupData, setSignupData] = useState<SignupData>({
    interest: '',
    age: {
      day: '',
      month: '',
      year: '',
    },
    basicDetails: {
      name: '',
      sex: '',
      interested: '',
      profession: '',
      education: '',
      relationshipStatus: '',
    },
    images: [],
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const updateData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const isComplete = currentStep === 4;

  const value: SignupContextType = {
    currentStep,
    signupData,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    isComplete,
  };

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
}; 