import React from 'react';
import { Button } from '@/components/ui/button';

interface DragDropAreaProps {
  dragActive: boolean;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleDragEnter: (_e: React.DragEvent) => void;
  handleDragLeave: (_e: React.DragEvent) => void;
  handleDragOver: (_e: React.DragEvent) => void;
  handleDrop: (_e: React.DragEvent) => void;
  handleFileInput: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DragDropArea = ({ dragActive, uploading, fileInputRef, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileInput }: DragDropAreaProps) => (
  <div
    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    onDragEnter={handleDragEnter}
    onDragLeave={handleDragLeave}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >
    <div className="space-y-4">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <div>
        <p className="text-lg font-medium text-gray-900">{uploading ? 'Uploading...' : 'Drop images here or click to upload'}</p>
        <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, GIF up to 10MB each</p>
      </div>

      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="mt-4">
        {uploading ? 'Uploading...' : 'Choose Files'}
      </Button>

      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
    </div>
  </div>
);
