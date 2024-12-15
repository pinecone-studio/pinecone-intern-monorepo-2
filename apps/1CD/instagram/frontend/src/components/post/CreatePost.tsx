'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

export const CreatePost = ({ openCreatePostModal, setOpenCreatePostModal }: { openCreatePostModal: boolean; setOpenCreatePostModal: Dispatch<SetStateAction<boolean>> }) => {
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const handleUploadImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    if (!files) return;

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
      return setImages((prevImages) => [...prevImages, uploadedImageUrl]), setStep(step + 1);
    });
  };
  console.log(images);
  return (
    <Dialog open={openCreatePostModal}>
      {step === 1 && (
        <DialogContent className=" w-[638px] h-[678px] [&>button]:hidden p-0  ">
          <DialogTitle className="text-center text-[16px]">Create new post</DialogTitle>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col items-center gap-4 cursor-pointer" htmlFor="file-upload">
              <div className="relative w-[96px] h-[77px]">
                <Image src="/images/Frame.png" alt="ImportPhoto" fill={true} className="w-auto h-auto" />
              </div>
              <p className="text-[20px]">Drag photos and videos here</p>
              <p className="bg-[#2563EB] text-sm px-4 py-[10px]   text-white rounded-lg">Select from computer</p>
            </label>

            <input id="file-upload" type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUploadImg} />
            <button className="font-sans text-gray-300 border-none " onClick={() => setOpenCreatePostModal(false)}>
              x
            </button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
