'use client';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useImageUpload } from './useImageUpload';
import { ImageModalContent } from './ImageModalContent';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_images: string[]) => void;
}

export interface ImageModalRef {
  handleSave: () => Promise<void>;
}

export const ImageModal = forwardRef<ImageModalRef, ImageModalProps>(({ isOpen, onClose, onSave }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedFiles, isUploading, handleFileSelect, removeFile, handleSave, handleClose, getPreviewUrl } = useImageUpload(onSave, onClose);

  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  const handleDrop = (_e: React.DragEvent) => {
    _e.preventDefault();
    handleFileSelect(_e.dataTransfer.files);
  };

  const handleDragOver = (_e: React.DragEvent) => {
    _e.preventDefault();
  };

  const handleFileInputChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(_e.target.files);
  };

  if (!isOpen) return null;

  return (
    <ImageModalContent
      selectedFiles={selectedFiles}
      isUploading={isUploading}
      fileInputRef={fileInputRef}
      handleDrop={handleDrop}
      handleDragOver={handleDragOver}
      handleFileInputChange={handleFileInputChange}
      handleClose={handleClose}
      handleSave={handleSave}
      removeFile={removeFile}
      getPreviewUrl={getPreviewUrl}
    />
  );
});

ImageModal.displayName = 'ImageModal';
