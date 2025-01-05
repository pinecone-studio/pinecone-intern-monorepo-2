'use client';
import { useGetPostByPostIdQuery } from '@/generated';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Bookmark, MessageCircle, SmileIcon } from 'lucide-react';
import { CommentCard } from '../comment/CommentCard';
import { PostLikes } from '../like/PostLikes';
import { PostLike } from '@/components/like/PostLike';
import { useAuth } from '../providers';
import { DialogTitle } from '@radix-ui/react-dialog';
import { DropMenu } from '../../app/(main)/_components/DropMenu';

export const PostImgCard = ({ id, image }: { id: string; image: string }) => {
  const [close, setClose] = useState<boolean>(false);
  const { data: PostData } = useGetPostByPostIdQuery({
    variables: {
      postId: id,
    },
  });
  const { user } = useAuth();
  const isUser = PostData?.getPostByPostId?.user?._id === user?._id;

  return (
    <Dialog data-testid="postWithComments1" open={close} onOpenChange={setClose}>
      <DialogTrigger data-testid="open-comment-btn" asChild>
        <Image src={image} alt="postnii-zurag" fill className="absolute object-cover cursor-pointer" sizes="h-auto w-auto" />
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden p-0 m-0 bg-none border-none " data-testid="postWithComments2">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <div className=" rounded-lg w-[1256px] h-[800px] [&>button]:hidden p-0 flex  " data-testid="postWithComments">
          <div className="w-full ">
            {PostData?.getPostByPostId?.images?.map((image, i) => {
              return (
                <div key={`img ${i}`} className="relative w-[800px] h-full">
                  <Image src={image} alt="img" fill={true} sizes="h-auto w-auto" className="object-cover w-auto h-auto rounded-tl-lg rounded-bl-lg" />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-between w-full px-3 py-4 bg-white" data-testid="postSection">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between border-b-[1px] pb-3 mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex w-8 h-8 rounded-full">
                    <Image sizes="h-auto w-auto" fill={true} src={PostData?.getPostByPostId?.user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" />
                  </div>
                  <h1 className="text-sm font-bold ">{PostData?.getPostByPostId?.user?.userName}</h1>
                </div>
                <div className="" data-testid="postSection1">
                  <DropMenu id={id} setClose={setClose} isUser={isUser} />
                </div>
              </div>

              <div className="flex items-center w-full gap-4 py-1">
                <div className="">
                  <div className="relative w-8 h-8 rounded-full">
                    <Image sizes="h-auto w-auto" src={PostData?.getPostByPostId?.user?.profileImg || '/images/profileImg.webp'} alt="proZurag" fill className="absolute object-cover rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm font-normal text-black">
                  <h1 className="text-sm font-bold text-black ">
                    {PostData?.getPostByPostId?.user?.userName}
                    <span className="pl-1 font-normal text-wrap">{PostData?.getPostByPostId?.description}</span>
                  </h1>
                  <p className="text-[12px] text-[#71717A]">1w</p>
                </div>
              </div>

              <CommentCard id={id} />
            </div>
            <div className="flex flex-col ">
              <div className="border-y-[1px] pb-4 mb-4">
                <div className="flex items-center justify-between px-1 py-3 text-xl">
                  <div className="flex gap-3">
                    <PostLike id={id} />
                    <p>
                      <MessageCircle />
                    </p>
                  </div>
                  <p>
                    <Bookmark />
                  </p>
                </div>

                <PostLikes id={id} />

                <p className="text-[12px] text-[#71717A]">1 day ago</p>
              </div>
              <div className="flex gap-4">
                <SmileIcon width={20} height={20} />
                <input type="text" placeholder="Add a comment ..." />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
