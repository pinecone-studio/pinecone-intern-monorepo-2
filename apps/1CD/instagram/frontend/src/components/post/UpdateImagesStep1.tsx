'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { UpdateImagesStep2 } from './UpdateImagesStep2';
import { Loader } from 'lucide-react';

export const UpdateImagesStep1 = ({ openCreatePostModal, setOpenCreatePostModal }: { openCreatePostModal: boolean; setOpenCreatePostModal: Dispatch<SetStateAction<boolean>> }) => {
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUploadImg2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('working 2222');
    const files = event?.target?.files;
    if (!files) return;
    setLoading(true);
    const filesArr = Array.from(files);
    return filesArr.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'instagram-intern');
      data.append('cloud_name', 'dka8klbhn');

      const res = await fetch('https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', {
        method: 'POST',
        body: data,
      });
      const uploadedImage = await res.json();
      const uploadedImageUrl: string = uploadedImage.secure_url;
      setImages((prevImages) => [...prevImages, uploadedImageUrl]);

      console.log('images', images);

      setOpenCreatePostModal(false);

      setStep(true);
      return setLoading(false);
    });
  };

  return (
    <Dialog open={openCreatePostModal} onOpenChange={setOpenCreatePostModal}>
      <DialogContent className="  [&>button]:hidden p-0 border-none " data-testid="step1">
        <DialogTitle className="text-center text-[16px]">Create new post</DialogTitle>

        <div className="flex flex-col gap-2 py-[190px]">
          {loading === true ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader className="w-10 h-10 text-2xl animate-spin" />
            </div>
          ) : (
            ''
          )}
          <label className="flex flex-col items-center gap-4 cursor-pointer" htmlFor="file-upload-22" data-testid="openInputBtn">
            <div className="relative w-[96px] h-[77px]">
              <Image sizes="h-auto w-auto" src="/images/Frame.png" alt="ImportPhoto" fill={true} className="w-auto h-auto" />
            </div>
            <p className="text-[20px]">Drag photos and videos here</p>
            <p className="bg-[#2563EB] text-sm px-4 py-[10px]   text-white rounded-lg">Select from computer</p>
          </label>

          <input data-testid="input" id="file-upload-22" type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUploadImg2} />
        </div>
      </DialogContent>

      <UpdateImagesStep2 step={step} setStep={setStep} images={images} setOpenCreatePostModal={setOpenCreatePostModal} loading={loading} setLoading={setLoading} />
    </Dialog>
  );
};
