'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { CiFaceSmile } from 'react-icons/ci';

export const CreatePost = ({ openModal, setOpenModal, images }: { images: string[]; openModal: boolean; setOpenModal: Dispatch<SetStateAction<boolean>> }) => {
  console.log('images new modal', images, setOpenModal);

  return (
    <Dialog open={openModal}>
      <DialogContent className="[&>button]:hidden p-0 m-0 ">
        <div className="bg-white rounded-lg w-[997px] h-[679px] [&>button]:hidden p-0 flex flex-col gap-4  ">
          <div>
            <DialogTitle className="text-center text-[16px] h-[35px] py-3  ">
              <div className="flex justify-between text-center text-[16px] px-1">
                {' '}
                <button>
                  <IoMdArrowBack />
                </button>
                <p>Create new post</p>
                <button className="text-[#2563EB]">Share</button>
              </div>
            </DialogTitle>
          </div>

          <div className="flex w-full h-full m-0">
            <div className="relative w-[654px] h-[628px]">
              <Image src="/images/img1.avif" alt="img" fill={true} className="object-cover w-auto h-auto rounded-bl-lg" />
            </div>
            <div className="w-[343px] p-4 gap-2 flex flex-col border-t-[1px] ">
              <div className="flex items-center gap-2">
                <div className="relative flex w-8 h-8 rounded-full">
                  <Image fill={true} src="/images/img.avif" alt="Photo1" className="w-auto h-auto rounded-full" />
                </div>
                <h1 className="text-sm font-bold ">defavours_11</h1>
              </div>
              <input type="text" className="w-full h-[132px] border rounded-lg" placeholder="Description ..." />
              <div className="flex justify-between border-t-[1px]">
                <CiFaceSmile />
                <p>0/200</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
