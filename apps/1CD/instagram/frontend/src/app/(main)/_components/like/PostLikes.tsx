'use client';
import { useGetPostLikesQuery } from '@/generated';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { FollowBtn } from '@/app/(main)/_components/follow/FollowButton';
import { useAuth } from '../../../../components/providers';

export const PostLikes = ({ id }: { id: string }) => {
  const { data } = useGetPostLikesQuery({
    variables: {
      postId: id,
    },
  });
  const { user } = useAuth();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row space-x-2 hover:cursor-pointer">
          <h1 className="text-sm cursor-pointer" data-testid="likeNumber" data-cy="likeNum">
            {data?.getPostLikes?.length === 0 ? '' : `${data?.getPostLikes?.length === 1 ? `${data?.getPostLikes?.length} like` : `${data?.getPostLikes?.length} likes`}`}
          </h1>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 p-0 min-w-96 min-h-96" data-cy="dialogLikes">
        <DialogHeader className="relative flex flex-row items-center justify-center h-10 px-4 py-6 border-b-2">
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col items-start p-0 m-0 space-y-2" data-testid="dialogLikes">
          <div className="flex items-center w-11/12 mx-auto">
            <Search size={18} />
            <Input type="text" placeholder="Search.." className="w-10/12 bg-transparent border-none input md:w-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-base" />
          </div>
          <div className="w-full space-y-2">
            {data?.getPostLikes.map((item) => (
              <div key={item?._id} className="flex flex-row items-center justify-between w-11/12 mx-auto" data-cy="dialogLikesCard">
                <Link href={`/home/viewprofile/${item?.user._id}`} className="flex items-center space-x-4">
                  <div className="relative rounded-full w-14 h-14">
                    <Image
                      src={item?.user.profileImg || '/images/profileImg.webp'}
                      alt="proZurag"
                      fill
                      className="absolute object-cover rounded-full"
                      data-cy="followerCardImg"
                      sizes="w-auto h-auto"
                    />
                  </div>
                  <div className="flex flex-col space-y-0">
                    <h1 className="text-lg font-semibold text-gray-700">{item?.user.userName}</h1>
                    <h1 className="text-sm font-medium">{item?.user.fullName}</h1>
                  </div>
                </Link>
                {item?.user._id === user?._id ? '' : <FollowBtn userId={item?.user._id || ''} />}
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
