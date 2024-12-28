'use client';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useImageSubmitMutation } from '@/generated';
import { uploadFilesInCloudinary } from '@/utils/cloudinary';
const ImageUpload = () => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageSubmit] = useImageSubmitMutation({
    onCompleted: () => {
      router.push('/sign-up/all-set');
    },
  });
  const handleNext = async () => {
    if (imageUrls.length > 0) {
      await handleImageSubmit(imageUrls);
    }
  };
  const handleBack = () => {
    router.push('/register/userdetails');
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const newFiles = Array.from(files);
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setUploading(true);
    const uploadedUrls = await Promise.all(newFiles.map((file) => uploadFilesInCloudinary(file)));
    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };
  const handleImageSubmit = async (uploadedUrls: string[]) => {
    await imageSubmit({
      variables: {
        input: {
          photos: uploadedUrls,
        },
      },
    });
  };
  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImageUrls(newImageUrls);
  };
  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;

    fileInput.click();
  };
  const renderGridItems = () => {
    const totalImages = selectedImages.length;
    const placeholders = 6;
    const gridItems = [];
    for (let i = 0; i < placeholders; i++) {
      gridItems.push(
        <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end" data-cy="image-placeholder">
          {selectedImages[i] ? (
            <div className="relative w-full h-full">
              <Image src={URL.createObjectURL(selectedImages[i])} alt={`Selected image ${i + 1}`} fill style={{ objectFit: 'cover' }} className="rounded-md" />
              <button
                className="absolute top-2 right-2 z-1 w-9 h-9 bg-white border border-[#E4E4E7] rounded-md flex justify-center items-center hover:bg-gray-100"
                onClick={() => handleRemoveImage(i)}
                data-cy="remove-button"
              >
                <X className="w-4" />
              </button>
            </div>
          ) : (
            <div className="h-full w-full bg-gray-200 border rounded-md flex justify-center items-center"></div>
          )}
        </div>
      );
    }
    for (let i = placeholders; i < totalImages; i++) {
      gridItems.push(
        <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end">
          <div className="relative w-full h-full">
            <Image src={URL.createObjectURL(selectedImages[i])} alt={`Selected image ${i + 1}`} fill style={{ objectFit: 'cover' }} className="rounded-md" data-cy="additional-image" />
          </div>
        </div>
      );
    }
    return gridItems;
  };
  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-1 mt-[78px]" data-cy="logo-container">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>
        <p className="text-2xl text-gray-900 font-semibold mt-[30px]" data-cy="question-title">
          Upload your images{' '}
        </p>
        <p className="text-[#71717A] text-sm" data-cy="question-description">
          Please choose an image that represents you.
        </p>
        <div className="grid grid-rows-2 grid-cols-3 gap-6 mt-[24px]">{renderGridItems()}</div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} id="file-input" multiple />
        <button
          onClick={handleButtonClick}
          className="rounded-full border border-1 border-[#E11D48] flex gap-2 w-[640px] justify-center py-2 mt-4 items-center hover:bg-gray-100"
          data-cy="upload-image-button"
          disabled={selectedImages.length >= 9}
        >
          <p className="text-[#E11D48] text-xl font-thin">+</p>
          <p className="text-sm">Upload image</p>
        </button>
        <div className="flex justify-between w-[640px] mt-2" data-cy="navigation-buttons">
          <button type="button" onClick={handleBack} className="hover:bg-gray-100 border border-1 rounded-full px-4 py-2" data-cy="back-button">
            Back
          </button>
          <button type="button" onClick={handleNext} className="hover:bg-gray-800 bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="next-button">
            {uploading ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageUpload;
