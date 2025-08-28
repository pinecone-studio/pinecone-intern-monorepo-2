import React from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageModalContentProps {
  selectedFiles: File[];
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (_e: React.DragEvent) => void;
  handleDragOver: (_e: React.DragEvent) => void;
  handleFileInputChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSave: () => void;
  removeFile: (_index: number) => void;
  getPreviewUrl: (_file: File) => string;
}

function renderHeader(handleClose: () => void) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Upload Room Images</h2>
      <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

function renderFileUploadArea(
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  handleDrop: (_e: React.DragEvent) => void,
  handleDragOver: (_e: React.DragEvent) => void,
  handleFileInputChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
) {
  return (
    <div className="mb-6">
      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInputChange} />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
      </div>
    </div>
  );
}

function renderSelectedImages(selectedFiles: File[], removeFile: (_index: number) => void, getPreviewUrl: (_file: File) => string) {
  if (selectedFiles.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-md font-medium text-gray-900 mb-4">Selected Images ({selectedFiles.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative group">
            <Image src={getPreviewUrl(file)} alt={`Preview ${index + 1}`} width={200} height={128} className="w-full h-32 object-cover rounded-lg" />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFooter(isUploading: boolean, selectedFiles: File[], handleClose: () => void, handleSave: () => void) {
  return (
    <div className="flex justify-end space-x-3">
      <button onClick={handleClose} className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors" disabled={isUploading}>
        Cancel
      </button>
      <button
        onClick={handleSave}
        className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        disabled={isUploading || selectedFiles.length === 0}
      >
        {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{isUploading ? 'Uploading...' : `Upload & Save (${selectedFiles.length} images)`}</span>
      </button>
    </div>
  );
}

function renderModalContent(props: ImageModalContentProps) {
  const { selectedFiles, isUploading, fileInputRef, handleDrop, handleDragOver, handleFileInputChange, handleClose, handleSave, removeFile, getPreviewUrl } = props;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {renderHeader(handleClose)}
        {renderFileUploadArea(fileInputRef, handleDrop, handleDragOver, handleFileInputChange)}
        {renderSelectedImages(selectedFiles, removeFile, getPreviewUrl)}
        {renderFooter(isUploading, selectedFiles, handleClose, handleSave)}
      </div>
    </div>
  );
}

export const ImageModalContent: React.FC<ImageModalContentProps> = (props) => renderModalContent(props);
