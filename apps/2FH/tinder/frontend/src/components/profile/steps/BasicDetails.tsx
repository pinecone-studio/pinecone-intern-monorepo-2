'use client';

import React, { useState } from 'react';
import { useSignup } from '@/components/profile/SignupContext';
import { validateField } from '@/utils/profile-validation';

// Helper function to handle field validation and updates
const handleFieldValidation = (
  field: 'name' | 'bio' | 'interests' | 'profession' | 'work',
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  handleInputChange: (_data: any) => void
) => {
  const validation = validateField(field, value);
  if (validation.success) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  } else {
    setErrors(prev => ({
      ...prev,
      [field]: validation.error || 'Алдаа'
    }));
  }
  handleInputChange({ [field]: value });
};

// Helper function to check if form can proceed
const canFormProceed = (signupData: any, _errors: Record<string, string>) => {
  return Boolean(
    signupData.name &&
    signupData.interests &&
    signupData.profession &&
    signupData.work
  ) && Object.keys(_errors).length === 0;
};

// Helper function to create field change handler
const createFieldChangeHandler = (setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>, handleInputChange: (_data: any) => void) => {
  return (field: 'name' | 'bio' | 'interests' | 'profession' | 'work', value: string) => {
    handleFieldValidation(field, value, setErrors, handleInputChange);
  };
};

// Helper function to get component state
const getBasicDetailsState = (signupData: any, errors: Record<string, string>, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>, handleInputChange: (_data: any) => void) => {
  return {
    canProceed: canFormProceed(signupData, errors),
    handleBasicDetailsChange: createFieldChangeHandler(setErrors, handleInputChange)
  };
};

// Individual field components
const NameField: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
    <input type="text" value={signupData.name} onChange={(e) => handleBasicDetailsChange('name', e.target.value)} placeholder="Enter your name" className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
  </div>
);

const BioField: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
    <textarea value={signupData.bio || ''} onChange={(e) => handleBasicDetailsChange('bio', e.target.value)} placeholder="Tell us about yourself" rows={3} className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.bio ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
  </div>
);

const InterestField: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Interest</label>
    <input type="text" value={signupData.interests} onChange={(e) => handleBasicDetailsChange('interests', e.target.value)} placeholder="What are your interests?" className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.interests ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
  </div>
);

const ProfessionField: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
    <input type="text" value={signupData.profession} onChange={(e) => handleBasicDetailsChange('profession', e.target.value)} placeholder="Enter your profession" className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.profession ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
  </div>
);

const WorkField: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">School/Work</label>
    <input type="text" value={signupData.work} onChange={(e) => handleBasicDetailsChange('work', e.target.value)} placeholder="Where do you study or work?" className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.work ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.work && <p className="text-red-500 text-xs mt-1">{errors.work}</p>}
  </div>
);

// Form fields component
const FormFields: React.FC<{ signupData: any; errors: Record<string, string>; handleBasicDetailsChange: (_field: 'name' | 'bio' | 'interests' | 'profession' | 'work', _value: string) => void }> = ({ signupData, errors, handleBasicDetailsChange }) => (
  <div className="text-left space-y-3">
    <NameField signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
    <BioField signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
    <InterestField signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
    <ProfessionField signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
    <WorkField signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
  </div>
);

export const BasicDetails: React.FC = () => {
  const { signupData, handleInputChange, nextStep, prevStep } = useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { canProceed, handleBasicDetailsChange } = getBasicDetailsState(signupData, errors, setErrors, handleInputChange);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white mt-10">
      <div className="w-full max-w-md text-center space-y-4">
        {/* Basic Details Form */}
        <FormFields signupData={signupData} errors={errors} handleBasicDetailsChange={handleBasicDetailsChange} />
        {/* Navigation Buttons */}
        <div className="flex my-5 justify-between w-full">
          <button onClick={prevStep} className="px-3 py-1 border border-gray-300 font-semibold rounded-full text-gray-700 hover:opacity-70 transition-all duration-200">Back</button>
          <button onClick={nextStep} disabled={!canProceed} className={`px-3 py-1 rounded-full text-white font-semibold transition-all duration-200 ${canProceed ? 'bg-[#E11D48E5] hover:opacity-80' : 'bg-gray-300 cursor-not-allowed'}`}>Next</button>
        </div>
      </div>
    </div>
  );
};
