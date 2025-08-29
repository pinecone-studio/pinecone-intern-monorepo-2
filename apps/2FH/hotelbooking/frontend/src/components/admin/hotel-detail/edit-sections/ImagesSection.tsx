'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { DragDropArea } from './DragDropArea';
import Image from 'next/image';
interface ImagesSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}
const ImageItem = ({ image, onRemove }: { image: string; onRemove: () => void }) => (
  <div className="relative group">
    <div className="relative aspect-square rounded-lg overflow-hidden border">
      <Image src={image} alt={`Hotel image`} fill className="object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <Button size="sm" variant="destructive" onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700">
          Remove
        </Button>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-1 text-center">Image</p>
  </div>
);
const useImageUpload = (formData: any, handleInputChange: (_field: string, _value: any) => void) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = 'dxjdxefkk';
    const uploadPreset = 'RoomImage';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }
    const data = await response.json();
    return data.secure_url;
  };
  const processImageFile = async (file: File): Promise<string> => {
    try {
      return await uploadToCloudinary(file);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      // Fallback to local file reading for test environment
      if (process.env.NODE_ENV === 'test') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      throw error;
    }
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      const newImages = await Promise.all(imageFiles.map(processImageFile));
      handleInputChange('images', [...formData.images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    preventDefault(e);
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    preventDefault(e);
    setDragActive(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    preventDefault(e);
    setDragActive(true);
  };
  const handleDrop = (e: React.DragEvent) => {
    preventDefault(e);
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFiles(e.target.files);
    }
  };
  return {
    dragActive,
    uploading,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
  };
};
export const ImagesSection = ({ formData, handleInputChange }: ImagesSectionProps) => {
  const { dragActive, uploading, fileInputRef, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileInput } = useImageUpload(formData, handleInputChange);
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: string, i: number) => i !== index);
    handleInputChange('images', newImages);
  };
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Hotel Images</Label>
        <p className="text-sm text-gray-600 mt-1">Upload images from your computer or phone</p>
      </div>
      {formData.images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image: string, index: number) => (
              <ImageItem key={index} image={image} onRemove={() => removeImage(index)} />
            ))}
          </div>
        </div>
      )}
      <DragDropArea
        dragActive={dragActive}
        uploading={uploading}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        handleDragEnter={handleDragEnter}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileInput={handleFileInput}
      />
      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing images...</span>
          </div>
        </div>
      )}
    </div>
  );
};