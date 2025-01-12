'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { useCreatePostMutation, useGetMyPostsQuery, useGetUserQuery } from '@/generated';
import { ArrowLeft, Loader, SmileIcon } from 'lucide-react';

export const CreatePost = ({
  openModal,
  setOpenModal,
  images,
  setStep,
  setLoading,
  loading,
}: {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  images: string[];
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<boolean>>;
}) => {
  const [handleDesc, setHandleDesc] = useState('');
  const { refetch } = useGetMyPostsQuery();
  const [createPost, { loading: loadingPost }] = useCreatePostMutation();
  const { data: user } = useGetUserQuery();

  const handleCreatePost = async () => {
    await createPost({
      variables: {
        images: images,
        description: handleDesc,
      },
    });
    await refetch();
  };
  const createPostBtn = () => {
    setLoading(true);
    handleCreatePost();
    setOpenModal(false);
    setLoading(false);
  };
  const closeModal = () => {
    setLoading(true);
    setOpenModal(false);
    setStep(true);
    setLoading(false);
  };
  return (
    <Dialog open={openModal}>
      <DialogContent className="[&>button]:hidden p-0 m-0 border-none max-w-[997px]  ">
        <div className="bg-white rounded-lg w-[997px] h-[679px] [&>button]:hidden p-0 flex flex-col gap-4  ">
          <div>
            <DialogTitle className="text-center text-[16px] h-[35px] py-3  ">
              <div className="flex justify-between text-center text-[16px] px-1">
                {' '}
                <button data-testid="closeModalBtn" onClick={closeModal}>
                  <ArrowLeft width={16} height={16} />
                </button>
                <p>Create new post</p>
                <button data-testid="createBtn" className="text-[#2563EB]" onClick={() => createPostBtn()}>
                  {loadingPost ? 'Sharing' : 'Share'}
                </button>
              </div>
            </DialogTitle>
          </div>

          <div className="flex w-full h-full m-0">
            <div className="relative w-[654px] h-[628px]">
              {loading === false ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Loader className="w-10 h-10 text-2xl animate-spin" />
                </div>
              ) : (
                ''
              )}
              <Image src={images[0]} alt="img" fill={true} sizes="h-auto w-auto" className="object-cover w-auto h-auto rounded-bl-lg" />
            </div>
            <div className="w-[343px] p-4 gap-2 flex flex-col border-t-[1px] ">
              <div className="flex items-center gap-2">
                <div className="relative flex w-8 h-8 rounded-full">
                  <Image fill={true} src={user?.getUser.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" sizes="h-auto w-auto" />
                </div>
                <h1 className="text-sm font-bold ">{user?.getUser.userName}</h1>
              </div>
              <input data-testid="input" type="text" className="w-full h-[132px] border rounded-lg p-2 text-start " placeholder="Description ..." onChange={(e) => setHandleDesc(e.target.value)} />
              <div className="flex justify-between border-b-[1px] py-3 text-[12px] text-[#71717A] ">
                <SmileIcon width={20} height={20} />
                <p>{handleDesc.length}/200</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
