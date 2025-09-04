'use client';

import { useCreateProfileMutation, Gender } from '@/generated';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface SignupData {
  dateOfBirth?: string;
  name: string;
  interests: string;
  interestedIn: string;
  profession: string;
  work: string;
  bio?: string;
  gender: string;
  images: string[];
  userId: string;
}

interface SignupContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (_step: number) => void;
  handleInputChange: (_data: Partial<SignupData>) => void;
  isComplete: boolean;
  signupData: SignupData;
  loading: boolean;
  error?: string;
  submitProfile: () => Promise<unknown>;
}

export const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) throw new Error('useSignup must be used within a SignupProvider');
  return context;
};

interface SignupProviderProps {
  children: ReactNode;
  userId: string; // ✅ mutation-д шаардлагатай
}
export const SignupProvider: React.FC<SignupProviderProps> = ({ children, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signupData, setSignupData] = useState<SignupData>({
    gender: '', // No default selection
    dateOfBirth: '',
    name: '',
    interests: '',
    interestedIn: '',
    profession: '',
    work: '',
    bio: '',
    images: [],
    userId: userId,
  });

  const [createProfile, { loading, error }] = useCreateProfileMutation({
    onCompleted: () => {
      console.log('✅ Profile created successfully');
      toast.success('Profile амжилттай үүслээ! 🎉');
      // Profile амжилттай үүссэний дараа Completion step рүү шилжих
      setCurrentStep(5);
    },
    onError: (err) => {
      console.error('❌ Error creating profile:', err);
      toast.error('Profile үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.');
    },
  });

  const handleInputChange = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
  };

  const submitProfile = async () => {
    return createProfile({
      variables: {
        input: {
          name: signupData.name,
          bio: signupData.bio || '',
          interests: signupData.interests.split(','),
          profession: signupData.profession,
          work: signupData.work,
          gender: signupData.gender.toLowerCase() as Gender,
          interestedIn: signupData.interestedIn.toLowerCase() as Gender,
          images: signupData.images,
          dateOfBirth: signupData.dateOfBirth || '',
          userId: signupData.userId,
        }
      }
    });
  };

  const nextStep = () => currentStep < 5 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
  const goToStep = (step: number) => step >= 0 && step <= 5 && setCurrentStep(step);
  const isComplete = currentStep === 5;

  const value: SignupContextType = {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    handleInputChange,
    isComplete,
    signupData,
    loading,
    error: error?.message,
    submitProfile,
  };

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
};
