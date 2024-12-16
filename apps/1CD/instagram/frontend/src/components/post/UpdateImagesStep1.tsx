'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { CreatePost } from './CreatePost';

export const UpdateImagesStep1 = ({ openCreatePostModal, setOpenCreatePostModal }: { openCreatePostModal: boolean; setOpenCreatePostModal: Dispatch<SetStateAction<boolean>> }) => {
  const [openModal, setOpenModal] = useState(false);
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

      setImages((prevImages) => [...prevImages, ...uploadedImageUrl]);
      return setStep(step + 1);
    });
  };

  return (
    <Dialog open={openCreatePostModal}>
      {step === 1 && (
        <DialogContent className="  [&>button]:hidden p-0  " data-testid="step1">
          <DialogTitle className="text-center text-[16px]">Create new post</DialogTitle>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col items-center gap-4 cursor-pointer" htmlFor="file-upload" data-testid="openInputBtn">
              <div className="relative w-[96px] h-[77px]">
                <Image src="/images/Frame.png" alt="ImportPhoto" fill={true} className="w-auto h-auto" />
              </div>
              <p className="text-[20px]">Drag photos and videos here</p>
              <p className="bg-[#2563EB] text-sm px-4 py-[10px]   text-white rounded-lg">Select from computer</p>
            </label>

            <input data-testid="input" id="file-upload" type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUploadImg} />
            <button className="font-sans text-gray-300 border-none " onClick={() => setOpenCreatePostModal(false)}>
              x
            </button>
          </div>
        </DialogContent>
      )}
      {step === 2 && (
        <DialogContent className=" [&>button]:hidden p-0  " data-testid="step2">
          <DialogTitle className="text-center text-[16px] h-[35px] py-3 ">
            <div className="flex justify-between text-center text-[16px] px-1">
              {' '}
              <button onClick={() => setStep(1)}>
                <IoMdArrowBack />
              </button>
              <p>Crop</p>
              <button
                className="text-[#2563EB]"
                onClick={() => {
                  return setOpenCreatePostModal(false), setOpenModal(true);
                }}
              >
                Next
              </button>
            </div>
          </DialogTitle>

          <div className="h-[626px] w-full m-o">
            <div className="relative w-full h-full">
              <Image src={images[0]} alt="img" fill={true} className="object-cover w-auto h-auto rounded-b-lg" />
            </div>
          </div>
        </DialogContent>
      )}
      <CreatePost setOpenModal={setOpenModal} openModal={openModal} images={images} />
    </Dialog>
  );
};
