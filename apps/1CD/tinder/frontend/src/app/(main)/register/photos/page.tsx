'use client';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useImageSubmitMutation } from '@/generated';
import { uploadFilesInCloudinary } from '@/utils/cloudinary';
import { Button } from '@/components/ui/button';

const ImageUpload = ({ onTabClick}:{ activeTab: 'profile' | 'images';
  onTabClick: (_tab: 'profile' | 'images') => void;
  isMenuOpen: boolean;}) => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageSubmit] = useImageSubmitMutation({
    onCompleted: () => {
      router.push('/register/all-set');
    },
  });

  // Handle Back Button Click (Navigate to profile page)
 
  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const newFiles = Array.from(files);
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setUploading(true);
    const uploadedUrls = await Promise.all(newFiles.map((file) => uploadFilesInCloudinary(file)));
    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  // Handle image submit (submit to API)
  const handleImageSubmit = async (uploadedUrls: string[]) => {
    await imageSubmit({
      variables: {
        input: {
          photos: uploadedUrls,
        },
      },
    });
  };

  // Remove an image from the selected images list
  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImageUrls(newImageUrls);
  };

  // Trigger the file input click
  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  // Render the grid of images
  const renderGridItems = () => {
    const totalImages = selectedImages.length;
    const placeholders = 6;
    const gridItems = [];
    for (let i = 0; i < placeholders; i++) {
      gridItems.push(
        <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end" data-cy="image-placeholder">
          {selectedImages[i] ? (
            <div className="relative w-full h-full">
              <Image
                src={URL.createObjectURL(selectedImages[i])}
                alt={`Selected image ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-md"
              />
              <button
                className="absolute top-2 right-2 z-1 w-9 h-9 bg-white border border-[#E4E4E7] rounded-md flex justify-center items-center hover:bg-gray-100"
                onClick={() => handleRemoveImage(i)}
                data-cy="remove-button"
              >
                <X className="w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 border rounded-md"></div>
          )}
        </div>
      );
    }
    for (let i = placeholders; i < totalImages; i++) {
      gridItems.push(
        <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end">
          <div className="relative w-full h-full">
            <Image
              src={URL.createObjectURL(selectedImages[i])}
              alt={`Selected image ${i + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
              data-cy="additional-image"
            />
          </div>
        </div>
      );
    }
    return gridItems;
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col ml-0 sm:ml-12 lg:ml-0">
        <h4 className="font-semibold text-lg leading-7 text-zinc-950">Your Images</h4>
        <p className="font-normal text-sm text-zinc-500 leading-5">Please choose an image that represents you.</p>
      </div>
      <hr className="bg-zinc-200 mt-6 ml-0 sm:ml-12 lg:ml-0" />
      <div className="flex flex-col items-center w-full mt-4">
        {/* Grid: Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
          {renderGridItems()}
        </div>

        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} id="file-input" multiple />
        <button
          onClick={handleButtonClick}
          className="rounded-full border border-1 border-[#E11D48] flex gap-2 w-full sm:w-[640px] justify-center py-2 mt-4 items-center hover:bg-gray-100"
          data-cy="upload-image-button"
          disabled={selectedImages.length >= 9} // Disable button after 9 images are selected
        >
          <p className="text-[#E11D48] text-xl font-thin">+</p>
          <p className="text-sm">Upload image</p>
        </button>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-[640px] mt-3 gap-2" data-cy="navigation-buttons">
          <button
            type="button"
            className="border hover:bg-gray-100 border-1 w-full sm:w-32 h-9 py-2 px-3 rounded-md text-center cursor-pointer font-medium text-sm "
            data-cy="back-button"
            onClick={() =>onTabClick('profile')}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => handleImageSubmit(imageUrls)}
            className="w-full sm:w-32 h-9 bg-rose-600 hover:bg-zinc-800 py-2 px-3 rounded-md text-white text-center cursor-pointer font-medium text-sm"
            data-cy="next-button"
          >
            {uploading ? 'Uploading...' : 'Update profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
