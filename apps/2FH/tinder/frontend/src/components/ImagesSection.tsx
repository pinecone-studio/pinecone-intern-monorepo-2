'use client';

import { useState, useRef } from 'react';

interface ImagesSectionProps {
  onSuccess: (_message: string) => void;
}

export const ImagesSection = ({ onSuccess: _onSuccess }: ImagesSectionProps) => {
  const [images, setImages] = useState<string[]>([
    // Placeholder images - in a real app, these would be actual image URLs
    '/placeholder-profile-1.jpg',
    '/placeholder-profile-2.jpg',
    '/placeholder-profile-3.jpg',
    '/placeholder-profile-4.jpg',
    '/placeholder-profile-5.jpg',
    '/placeholder-profile-6.jpg',
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your backend
      // For now, we'll create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, imageUrl]);
      _onSuccess('Image uploaded successfully');
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // In a real app, you would also delete the image from your backend
      return newImages;
    });
    _onSuccess('Image deleted successfully');
  };

  const handleSaveImages = () => {
    // In a real app, you would save the image order/selection to your backend
    console.log('Saving images:', images);
    _onSuccess('Images saved successfully');
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Images</h2>
        <p className="text-gray-600">Please choose an image that represents you.</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
              {/* Placeholder for actual image */}
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <p className="text-sm">Profile {index + 1}</p>
                </div>
              </div>
            </div>
            
            {/* Delete Button */}
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors group-hover:opacity-100 opacity-0 shadow-sm"
              title="Delete image"
            >
              <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        
        {/* Add Image Placeholder */}
        {images.length < 9 && (
          <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">Add Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleUploadImage}
          className="flex items-center space-x-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Upload image</span>
        </button>

        <button
          onClick={handleSaveImages}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Save Images
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Instructions */}
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3 text-lg">Image Guidelines:</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Upload clear, high-quality photos
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Show your face clearly in at least one photo
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Avoid group photos or heavily filtered images
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Maximum 9 images allowed
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Supported formats: JPG, PNG, GIF
          </li>
        </ul>
      </div>
    </div>
  );
}; 