'use client';

import React, { useState, useRef } from 'react';
import { useSignup } from '@/components/profile/SignupContext';

export const ImageUpload: React.FC = () => {
  const { signupData, updateData, nextStep, prevStep } = useSignup();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    const updatedImages = [...signupData.images, ...newImages].slice(0, 6);
    updateData({ images: updatedImages });
  };

  const removeImage = (index: number) => {
    const updatedImages = signupData.images.filter((_, i) => i !== index);
    updateData({ images: updatedImages });
  };

  const canProceed = signupData.images.length > 0;

  return (
    <div className="w-full h-full">
      {/* Image Upload Area */}
      <div className="w-full text-center flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`h-[150px] rounded-lg border-2 border-dashed flex items-center justify-center relative ${
                signupData.images[index]
                  ? 'border-gray-300'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              {signupData.images[index] ? (
                <>
                  <img
                    src={signupData.images[index]}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500  text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
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

        {/* Upload Button */}
        <div
          className={`border-2 border-dashed rounded-lg text-center transition-colors ${
            dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Upload image
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex py-3 justify-between">
        <button
          onClick={prevStep}
          className="px-3 py-1 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`px-3 py-1  rounded-lg font-semibold text-white transition-all duration-200 ${
            canProceed
              ? 'bg-[#E11D48E5] hover:opacity-80'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}; 