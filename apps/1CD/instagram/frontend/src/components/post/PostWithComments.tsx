'use client';
import { useGetPostByPostIdQuery } from '@/generated';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageCircle, MoreVertical } from 'lucide-react';
import { CommentCard } from '../../app/(main)/_components/comment/CommentCard';
import { PostLikes } from '../../app/(main)/_components/like/PostLikes';
import { CommentCount } from '@/components/comment/CommentCount';
import { PostLike } from '@/components/like/PostLike';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PostImg } from '../visit-profile/PostImgCarousel';
import Link from 'next/link';
import { CreateComment } from '../comment/CreateComment';

export const PostWithComments = ({ id }: { id: string }) => {
  const { data: PostData } = useGetPostByPostIdQuery({
    variables: {
      postId: id,
    },
  });

  return (
    <Dialog data-testid="postWithComments1">
      <DialogTrigger data-testid="open-comment-btn" asChild>
        <div className="flex flex-row py-1 space-x-2 text-sm text-gray-500 hover:cursor-pointer">
          <CommentCount id={id} />
        </div>
      </DialogTrigger>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="[&>button]:hidden p-0 m-0 bg-none border-none flex justify-center max-w-[1256px]  ">
        <div className=" rounded-lg w-[1256px] h-[800px] [&>button]:hidden p-0 flex  relataive" data-testid="postWithComments">
          <PostImg images={PostData?.getPostByPostId?.images || []} />
          <div className="flex flex-col justify-between w-full h-full px-3 py-4 bg-white">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between border-b-[1px] pb-3 mb-4">
                <Link href={`/home/viewprofile/${PostData?.getPostByPostId?.user._id}`} className="flex items-center gap-4">
                  <div className="relative flex w-8 h-8 rounded-full">
                    <Image sizes="h-auto w-auto" fill={true} src={PostData?.getPostByPostId?.user.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" />
                  </div>
                  <h1 className="text-sm font-bold ">{PostData?.getPostByPostId?.user.userName}</h1>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-4 h-4 p-0 ">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
                    <DropdownMenuItem>Hide</DropdownMenuItem>
                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ScrollArea className="w-full h-[560px] pr-3">
                <Link href={`/home/viewprofile/${PostData?.getPostByPostId?.user._id}`} className="flex items-center w-full gap-4 py-1">
                  <div className="">
                    <div className="relative w-8 h-8 rounded-full">
                      <Image sizes="h-auto w-auto" src={PostData?.getPostByPostId?.user.profileImg || '/images/profileImg.webp'} alt="proZurag" fill className="absolute object-cover rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm font-normal text-black">
                    <h1 className="text-sm font-bold text-black ">
                      {PostData?.getPostByPostId?.user.userName}
                      <span className="pl-1 font-normal text-wrap">{PostData?.getPostByPostId?.description}</span>
                    </h1>
                    <p className="text-[12px] text-[#71717A]">1w</p>
                  </div>
                </Link>

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
  );
};
