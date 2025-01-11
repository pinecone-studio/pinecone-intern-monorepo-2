'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { useGetMyPostsQuery, useGetPostByPostIdQuery, useUpdatePostMutation } from '@/generated';
import { SmileIcon } from 'lucide-react';

export const UpdatePost = ({ id, setOpenUpdateModal, openUpdateModal }: { id: string; setOpenUpdateModal: Dispatch<SetStateAction<boolean>>; openUpdateModal: boolean }) => {
  const [updatePost] = useUpdatePostMutation();

  const { data: PostData } = useGetPostByPostIdQuery({
    variables: {
      postId: id,
    },
  });
  const [handleDesc, setHandleDesc] = useState(PostData?.getPostByPostId?.description);
  const { refetch } = useGetMyPostsQuery();
  const handleEditPost = async () => {
    await updatePost({
      variables: {
        input: {
          _id: id,
          description: handleDesc,
        },
      },
    });
    await refetch();
    setOpenUpdateModal(false);
  };

  return (
    <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="[&>button]:hidden p-0 m-0 border-none ">
        <div className="bg-white rounded-lg w-[997px] h-[679px] [&>button]:hidden p-0 flex flex-col gap-4  ">
          <div>
            <DialogTitle className="text-center text-[16px] h-[35px] py-3  ">
              <div className="flex justify-between text-center text-[16px] px-1">
                {' '}
                <button data-testid="closeModalBtn" onClick={() => setOpenUpdateModal(false)}>
                  Cancel
                </button>
                <p>Edit a post</p>
                <button data-testid="createBtn" className="text-[#2563EB]" onClick={handleEditPost}>
                  Edit
                </button>
              </div>
            </DialogTitle>
          </div>

          <div className="flex w-full h-full m-0">
            <div className="relative w-[654px] h-[628px]">
              <Image src={PostData?.getPostByPostId?.images[0] || '/images/profileImg.webp'} alt="img" sizes="h-auto w-auto" fill={true} className="object-cover w-auto h-auto rounded-bl-lg" />
            </div>
            <div className="w-[343px] p-4 gap-2 flex flex-col border-t-[1px] ">
              <div className="flex items-center gap-2">
                <div className="relative flex w-8 h-8 rounded-full">
                  <Image sizes="h-auto w-auto" fill={true} src={PostData?.getPostByPostId?.user.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" />
                </div>
                <h1 className="text-sm font-bold ">{PostData?.getPostByPostId?.user?.userName}</h1>
              </div>
              <input
                data-testid="input"
                type="text"
                className="w-full h-[132px] border rounded-lg p-2"
                placeholder="Description ..."
                value={handleDesc || ''}
                onChange={(e) => setHandleDesc(e.target.value)}
              />
              <div className="flex justify-between border-b-[1px] py-3 text-[12px] text-[#71717A] ">
                <SmileIcon width={20} height={20} />
                <p>{handleDesc?.length}/200</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
