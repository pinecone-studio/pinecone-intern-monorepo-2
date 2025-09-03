'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSignup } from '@/components/profile/SignupContext';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dz3pleqcg/upload';
const UPLOAD_PRESET = 'tinder'; // Cloudinary-д үүсгэсэн unsigned preset

// Helper function to upload single file
const uploadSingleFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data['secure_url'] || null;
};

// Helper function to handle drag events
const handleDragEvent = (e: React.DragEvent, setDragActive: (_active: boolean) => void) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
  if (e.type === 'dragleave') setDragActive(false);
};

// Helper function to get component state
const getImageUploadState = (signupData: any, uploadLoading: boolean, setDragActive: (_active: boolean) => void) => {
  return {
    canProceed: signupData.images.length > 0 && !uploadLoading,
    handleDrag: (e: React.DragEvent) => handleDragEvent(e, setDragActive)
  };
};

// Helper function to create event handlers
const createEventHandlers = (setDragActive: (_active: boolean) => void, handleFiles: (_files: FileList) => void) => {
  return {
    handleDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    },
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
    }
  };
};

// Image grid component
const ImageGrid: React.FC<{ signupData: any; removeImage: (_index: number) => void }> = ({ signupData, removeImage }) => (
  <div className="grid grid-cols-3 gap-3 p-4">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className={`h-[150px] rounded-lg border-2 border-dashed flex items-center justify-center relative ${signupData.images[idx] ? 'border-gray-300' : 'border-gray-300 bg-gray-50'}`}>
        {signupData.images[idx] ? (
          <>
            <img src={signupData.images[idx]} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
            <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Add</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

// Upload area component
const UploadArea: React.FC<{ dragActive: boolean; uploadLoading: boolean; handleDrag: (_e: React.DragEvent) => void; handleDrop: (_e: React.DragEvent) => void; handleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void; fileInputRef: React.RefObject<HTMLInputElement> }> = ({ dragActive, uploadLoading, handleDrag, handleDrop, handleChange, fileInputRef }) => (
  <div className={`border-2 border-dashed rounded-lg text-center m-4 p-4 transition-colors cursor-pointer ${dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
    <span className="text-pink-500 font-medium hover:text-pink-600">{uploadLoading ? 'Uploading...' : 'Upload image'}</span>
  </div>
);

// Navigation buttons component
const NavigationButtons: React.FC<{ prevStep: () => void; canProceed: boolean; loading: boolean; submitProfile: () => void; setShouldProceed: (_value: boolean) => void }> = ({ prevStep, canProceed, loading, submitProfile, setShouldProceed }) => (
  <div className="flex justify-between p-4">
    <button onClick={prevStep} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all">Back</button>
    <button onClick={() => { submitProfile(); setShouldProceed(true); }} disabled={!canProceed || loading} className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${canProceed && !loading ? 'bg-pink-500 hover:opacity-80' : 'bg-gray-300 cursor-not-allowed'}`}>
      {loading ? 'Creating...' : 'Next'}
    </button>
  </div>
);

export const ImageUpload: React.FC = () => {
  const { signupData, handleInputChange, nextStep, prevStep, submitProfile, loading, error } = useSignup();
  const [dragActive, setDragActive] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [shouldProceed, setShouldProceed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldProceed && !loading && !error) {
      nextStep();
      setShouldProceed(false);
    }
  }, [shouldProceed, loading, error, nextStep]);

  const handleFiles = async (files: FileList) => {
    setUploadLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadSingleFile(files[i]);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        handleInputChange({ images: [...signupData.images, ...uploadedUrls].slice(0, 6) });
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = signupData.images.filter((_, i) => i !== index);
    handleInputChange({ images: updatedImages });
  };

  const { canProceed, handleDrag } = getImageUploadState(signupData, uploadLoading, setDragActive);
  const { handleDrop, handleChange } = createEventHandlers(setDragActive, handleFiles);



  return (
    <div className="w-full h-full flex flex-col justify-between">
      <ImageGrid signupData={signupData} removeImage={removeImage} />
      <UploadArea dragActive={dragActive} uploadLoading={uploadLoading} handleDrag={handleDrag} handleDrop={handleDrop} handleChange={handleChange} fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>} />
      <NavigationButtons prevStep={prevStep} canProceed={canProceed} loading={loading} submitProfile={submitProfile} setShouldProceed={setShouldProceed} />
    </div>
  );
};
