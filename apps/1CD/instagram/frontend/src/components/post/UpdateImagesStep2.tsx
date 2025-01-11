'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { CreatePost } from '../../app/(main)/_components/post/CreatePost';
import { ArrowLeft, Loader } from 'lucide-react';

export const UpdateImagesStep2 = ({
  step,
  setStep,
  images,
  setOpenCreatePostModal,
  setLoading,
  loading,
}: {
  step: boolean;
  setStep: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  images: string[];
  setOpenCreatePostModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [openModal, setOpenModal] = useState(false);

  const modal = () => {
    setLoading(true);
    setStep(false);
    setOpenModal(true);
    setLoading(false);
  };
  const closeModal = () => {
    setLoading(true);
    setOpenCreatePostModal(true);
    setStep(false);
    setLoading(false);
  };
  return (
    <Dialog open={step} onOpenChange={setStep}>
      <DialogContent data-testid="step2" className=" [&>button]:hidden p-0   m-0 border-none">
        <DialogTitle className="text-center text-[16px] h-[35px] py-3 ">
          <div className="flex justify-between text-center text-[16px] px-1">
            {' '}
            <button onClick={closeModal} data-testid="Btn1" className="cursor-pointer">
              <ArrowLeft width={16} height={16} />
            </button>
            <p>Crop</p>
            <button data-testid="Btn2" className="text-[#2563EB]" onClick={() => modal()}>
              Next
            </button>
          </div>
        </DialogTitle>

        <div className="h-[626px] w-full m-0 ">
          <div className="relative w-full h-full">
            {loading === false ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Loader className="w-10 h-10 text-2xl animate-spin" />
              </div>
            ) : (
              ''
            )}
            <Image src={images[0]} alt="img" sizes="h-auto w-auto" fill={true} className="object-cover w-auto h-auto rounded-b-lg" />
          </div>
        </div>
      </DialogContent>
      <CreatePost setOpenModal={setOpenModal} openModal={openModal} images={images} setStep={setStep} loading={loading} setLoading={setLoading} />
    </Dialog>
  );
};
