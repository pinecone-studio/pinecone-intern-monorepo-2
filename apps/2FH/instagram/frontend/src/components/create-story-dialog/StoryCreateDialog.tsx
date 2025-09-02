'use client';

import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { FileUploadArea } from './FileUploadArea';
import { FilePreview } from './FilePreview';
import { DialogActions } from './DialogActions';
import { useCreateStoryMutation } from '@/generated';

interface Props { 
  isOpen: boolean; 
  onClose: () => void;
  testHandleUpload?: React.MutableRefObject<(() => Promise<void>) | null>; 
}

export const StoryCreateDialog = ({ isOpen, onClose, testHandleUpload }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_UPLOAD_PRESET = 'intern-ig-hf-story';
  const CLOUDINARY_CLOUD_NAME = 'dhvup7uyy';

  const [createStory, { loading }] = useCreateStoryMutation({
    onCompleted: () => {
      setUploading(false); 
      setFile(null); 
      setPreview(null); 
      onClose();
    },
    onError: (err) => { 
      setError(err.message); 
      setUploading(false); 
    },
  });

  const selectFile = (f: File) => {
    if (!f.type.startsWith('image/')) { 
      setError('Select image only'); 
      return; 
    }
    setFile(f); 
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const uploadToCloudinary = async (f: File) => {
    const fd = new FormData();
    fd.append('file', f);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd.append('folder', 'stories');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, 
      { method: 'POST', body: fd }
    );
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleUpload = useCallback(async () => {
    if (!file) { 
      setError('Select image'); 
      return; 
    }
    setUploading(true); 
    setError('');
    try {
      const url = await uploadToCloudinary(file);
      await createStory({ variables: { input: { image: url } } });
    } catch { 
      setError('Upload failed'); 
      setUploading(false); 
    }
  }, [file, createStory]);

  React.useEffect(() => {
    if (testHandleUpload) {
      testHandleUpload.current = handleUpload;
    }
  }, [testHandleUpload, handleUpload]);

  const handleClose = () => { 
    setFile(null); 
    setPreview(null); 
    setError(''); 
    setUploading(false); 
    onClose(); 
  };

  const handleRemovePreview = () => {
    setFile(null); 
    setPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Story</h2>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20}/>
          </button>
        </div>

        <div className="p-4">
          {!preview ? (
            <FileUploadArea onFileSelect={selectFile} fileRef={fileRef as React.RefObject<HTMLInputElement>} />
          ) : (
            <FilePreview 
              preview={preview} 
              file={file} 
              onRemove={handleRemovePreview} 
            />
          )}

          <input 
            ref={fileRef} 
            type="file" 
            accept="image/*" 
            onChange={e => e.target.files?.[0] && selectFile(e.target.files[0])} 
            className="hidden"
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogActions 
          file={file}
          isUploading={isUploading}
          loading={loading}
          onUpload={handleUpload}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default StoryCreateDialog;