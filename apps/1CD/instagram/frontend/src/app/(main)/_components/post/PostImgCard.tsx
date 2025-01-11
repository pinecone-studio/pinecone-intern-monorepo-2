'use client';
import { useGetPostByPostIdQuery } from '@/generated';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Bookmark, MessageCircle } from 'lucide-react';

import { PostLike } from '@/components/like/PostLike';

import { DialogTitle } from '@radix-ui/react-dialog';
import { DropMenu } from './DropMenu';
import { UpdatePost } from './UpdatePost';

import Link from 'next/link';
import { CreateComment } from '@/components/comment/CreateComment';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PostLikes } from '@/app/(main)/_components/like/PostLikes';
import { CommentCard } from '../comment/CommentCard';
import { PostImg } from '@/components/visit-profile/PostImgCarousel';
import { useAuth } from '@/components/providers';
import { DeleteModal } from '@/app/(main)/_components/post/DeleteModal';
export const PostImgCard = ({ id, image }: { id: string; image: string }) => {
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);

  const { data: PostData } = useGetPostByPostIdQuery({
    variables: {
      postId: id,
    },
  });
  const { user } = useAuth();
  const isUser = PostData?.getPostByPostId?.user?._id === user?._id;

  return (
    <>
      <Dialog data-testid="postWithComments1" open={close} onOpenChange={setClose}>
        <DialogTrigger
          data-testid="open-comment-btn"
          onClick={() => {
            return setClose(true);
          }}
          asChild
        >
          <Image src={image} alt="postnii-zurag" fill className="absolute object-cover cursor-pointer" sizes="h-auto w-auto" />
        </DialogTrigger>
        <DialogContent className="[&>button]:hidden p-0 m-0 bg-none border-none max-w-[1256px]  " data-testid="postWithComments2">
          <DialogTitle className="hidden"></DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <div className=" rounded-lg w-[1256px] h-[800px] [&>button]:hidden p-0 flex  " data-testid="postWithComments">
            <PostImg images={PostData?.getPostByPostId?.images || []} />
            <div className="flex flex-col justify-between w-full px-3 py-4 bg-white" data-testid="postSection">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between border-b-[1px] pb-3 mb-4">
                  <Link href={`/home/viewprofile/${PostData?.getPostByPostId?.user?._id}`} className="flex items-center gap-4">
                    <div className="relative flex w-8 h-8 rounded-full">
                      <Image sizes="h-auto w-auto" fill={true} src={PostData?.getPostByPostId?.user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" />
                    </div>
                    <h1 className="text-sm font-bold ">{PostData?.getPostByPostId?.user?.userName}pp</h1>
                  </Link>
                  <div className="" data-testid="postSection1">
                    <DropMenu setClose={setClose} isUser={isUser} setOpenUpdateModal={setOpenUpdateModal} setOpenDeleteModal={setOpenDeleteModal} />
                  </div>
                </div>
                <ScrollArea className="w-full h-[560px] pr-3">
                  <div className="flex items-center w-full gap-4 py-1">
                    <Link href={`/home/viewprofile/${PostData?.getPostByPostId?.user?._id}`} className="">
                      <div className="relative w-8 h-8 rounded-full">
                        <Image
                          sizes="h-auto w-auto"
                          src={PostData?.getPostByPostId?.user?.profileImg || '/images/profileImg.webp'}
                          alt="proZurag"
                          fill
                          className="absolute object-cover rounded-full"
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col gap-1 text-sm font-normal text-black">
                      <h1 className="text-sm font-bold text-black ">
                        {PostData?.getPostByPostId?.user?.userName}
                        <span className="pl-1 font-normal text-wrap">{PostData?.getPostByPostId?.description}</span>
                      </h1>
                      <p className="text-[12px] text-[#71717A]">1w</p>
                    </div>
                  </div>
                  <CommentCard id={id} />
                </ScrollArea>
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
                <CreateComment id={id} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UpdatePost id={id} setOpenUpdateModal={setOpenUpdateModal} openUpdateModal={openUpdateModal} />
      <DeleteModal id={id} openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} />
    </>
  );
};
