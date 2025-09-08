import { useState } from 'react';

export const useImageUpload = (onSave: (_images: string[]) => void, onClose: () => void) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    // eslint-disable-next-line camelcase
    const { secure_url: secureUrl } = data;
    return secureUrl;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
      }
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllImages = async () => {
    setIsUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of selectedFiles) {
        try {
          const url = await uploadToCloudinary(file);
          newUrls.push(url);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }
      onSave(newUrls);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (selectedFiles.length === 0) return;
    await uploadAllImages();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const getPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return {
    selectedFiles,
    isUploading,
    handleFileSelect,
    removeFile,
    handleSave,
    handleClose,
    getPreviewUrl,
  };
};
