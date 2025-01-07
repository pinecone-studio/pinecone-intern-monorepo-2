'use client';

import Image from 'next/image';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bookmark, Dot, Loader, MessageCircle, MoreVertical, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetMyFollowingsPostsQuery } from '@/generated';
import { PostLike } from '@/components/like/PostLike';
import { formatDistanceToNowStrict } from 'date-fns';
import { PostLikes } from '@/components/like/PostLikes';
import { LastCommentCard } from '../../../components/comment/LastCommentCard';
import { PostWithComments } from '../../../components/post/PostWithComments';
import { PostImg } from '../../../components/post/PostImgCarousel';

export const PostCard = () => {
  const { data, loading } = useGetMyFollowingsPostsQuery();

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[300px]" data-testid="loader">
        <Loader className="text-2xl animate-spin " />
      </div>
    );
  }

  return (
    <div className="w-full md:px-[40px] px-5" data-testid="post-card">
      {data?.getMyFollowingsPosts.map((post) => {
        return (
          <div key={post?._id} className="md:border-b-[1px] md:pb-5">
            <div className="flex items-center justify-between py-[12px]">
              <div className="flex items-center gap-2">
                <div className="relative flex rounded-full w-9 h-9">
                  <Image fill={true} src={post?.user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="object-cover w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
                </div>

                <h1 className="flex items-center font-bold ">
                  {post?.user?.userName}
                  <span className="flex items-center font-normal text-gray-600 ">
                    <Dot />
                    {formatDistanceToNowStrict(new Date(post?.createdAt))}
                  </span>
                </h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" data-testid="more-btn" className="w-8 h-8 p-0 ">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem data-testid="delete-btn" className="text-red-600">
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>Hide</DropdownMenuItem>
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <PostImg images={post?.images} />

            <div className="flex items-center justify-between px-1 py-3 text-xl">
              <div className="flex gap-3">
                <PostLike id={post?._id} />
                <p>
                  <MessageCircle />
                </p>
              </div>
              <p>
                <Bookmark />
              </p>
            </div>
            <PostLikes id={post?._id} />
            <div>
              <h1 className="text-base font-normal text-gray-600">
                <span className="pr-1 font-bold text-black">{post.user.userName}</span>
                {post.description}
              </h1>
            </div>

            <PostWithComments id={post?._id} />
            <LastCommentCard id={post._id} />
            <div className="flex justify-between ">
              <input type="text" className="text-sm border-none" placeholder="Add a comment..." />
              <p>
                <Smile strokeWidth={1} width={18} height={18} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
