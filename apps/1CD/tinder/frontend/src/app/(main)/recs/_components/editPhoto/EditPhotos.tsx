'use client';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useImageSubmitMutation } from '@/generated';
import { uploadFilesInCloudinary } from '@/utils/cloudinary';
import { useGetMeQuery } from '@/generated';

const ImageUpload = () => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data } = useGetMeQuery();
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [imageSubmit] = useImageSubmitMutation({
    onCompleted: () => {
      router.push('/recs');
    },
  });
  useEffect(() => {
    if (data?.getMe?.photos) {
      setExistingImages(data.getMe.photos);
    }
  }, [data]);

  const handleNext = async () => {
    const allImages = [...existingImages, ...imageUrls];
    if (allImages.length > 0) {
      await handleImageSubmit(allImages);
    }
  };

  const handleBack = () => {
    router.push('/register/details');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const newFiles = Array.from(files);

    setUploading(true);
    const uploadedUrls = await Promise.all(newFiles.map((file) => uploadFilesInCloudinary(file)));

    const newSelectedImages = [...selectedImages];
    const newImageUrls = [...imageUrls];

    for (let i = 0; i < newFiles.length; i++) {
      const firstEmptyIndex = existingImages.length + newSelectedImages.length;
      if (firstEmptyIndex < 6) {
        newSelectedImages.push(newFiles[i]);
        newImageUrls.push(uploadedUrls[i]);
      }
    }

    setSelectedImages(newSelectedImages);
    setImageUrls(newImageUrls);
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

  const handleRemoveImage = (index: number, isExisting = false) => {
    if (isExisting) {
      const updatedExistingImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExistingImages);
    } else {
      const newImages = selectedImages.filter((_, i) => i !== index);
      const newImageUrls = imageUrls.filter((_, i) => i !== index);
      setSelectedImages(newImages);
      setImageUrls(newImageUrls);
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  const renderGridItems = () => {
    const placeholders = 6;
    const gridItems = [];
    const allImages = [...existingImages, ...imageUrls];

    for (let i = 0; i < placeholders; i++) {
      if (allImages[i]) {
        gridItems.push(
          <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end max-sm:h-[148px]" data-cy="existing-image">
            <div className="relative w-full h-full">
              <Image src={allImages[i]} alt={`Image ${i + 1}`} fill style={{ objectFit: 'cover' }} className="rounded-md" />
              <button
                className="absolute top-2 right-2 z-1 w-9 h-9 bg-white border border-[#E4E4E7] rounded-md flex justify-center items-center hover:bg-gray-100"
                onClick={() => handleRemoveImage(i, i < existingImages.length)}
                data-cy="remove-button-existing"
              >
                <X className="w-4" />
              </button>
            </div>
          </div>
        );
      } else {
        gridItems.push(
          <div key={i} className="h-[296px] aspect-[2/3] rounded-md flex justify-end max-sm:h-[148px]" data-cy="image-placeholder">
            <div className="flex items-center justify-center w-full h-full bg-gray-200 border rounded-md"></div>
          </div>
        );
      }
    }

    return gridItems;
  };

  return (
    <div className="flex justify-center w-full max-w-4xl mx-auto">
      <div className="flex flex-col w-full">
        <p className="text-2xl text-gray-900 font-semibold" data-cy="question-title">
          Your Images
        </p>
        <p className="text-[#71717A] text-sm mt-[10px]" data-cy="question-description">
          Please choose an image that represents you.
        </p>
        <div className="h-[1px] bg-gray-200 mt-4"></div>
        <div className="grid grid-rows-2 grid-cols-3 gap-6 mt-[24px]">{renderGridItems()}</div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} id="file-input" multiple />
        <button
          onClick={handleButtonClick}
          className="rounded-full border border-1 border-[#E11D48] flex gap-2 w-[640px] justify-center py-2 mt-4 items-center hover:bg-gray-100 max-sm:w-[350px]"
          data-cy="upload-image-button"
          disabled={selectedImages.length >= 9}
        >
          <p className="text-[#E11D48] text-xl font-thin">+</p>
          <p className="text-sm">Upload image</p>
        </button>
        <div className="flex justify-between w-[640px] mt-2 max-sm:w-[350px]" data-cy="navigation-buttons">
          <button type="button" onClick={handleBack} className="px-4 py-2 border rounded-full hover:bg-gray-100 border-1" data-cy="back-button">
            Back
          </button>
          <button type="button" onClick={handleNext} className="hover:bg-gray-800 bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="next-button">
            {uploading ? 'Uploading...' : 'Update Images'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
