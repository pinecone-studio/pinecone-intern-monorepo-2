'use client';
import { useGetCommentsQuery } from '@/generated';
import React, { useState } from 'react';
import Image from 'next/image';
import { Ellipsis, Heart } from 'lucide-react';
import Link from 'next/link';
import { DeleteCommentModal } from './DeleteComment';
import { useAuth } from '@/components/providers';


export const CommentCard = ({ id }: { id: string }) => {
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false);
  const { data, refetch } = useGetCommentsQuery({
    variables: {
      postId: id,
    },
  });
  const { user } = useAuth();

  return (
    <div className="" data-testid="getComments">
      {data?.getComments.map((item) => (
        <div key={item?._id} className="flex items-start justify-between gap-2 py-1 ">
          <div className="flex gap-4 py-1 ">
            <Link href={`/home/viewprofile/${item?.commentedUser._id}`} className="">
              <div className="relative w-8 h-8 rounded-full cursor-pointer">
                <Image
                  src={item?.commentedUser.profileImg || '/images/profileImg.webp'}
                  alt="proZurag"
                  fill
                  className="absolute object-cover rounded-full"
                  data-cy="followerCardImg"
                  sizes="w-auto h-auto"
                />
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <h1 className="text-sm font-bold text-black">
                {item?.commentedUser.userName}
                <span className="pl-1 text-sm font-normal text-black text-wrap">{item?.commentText}</span>
              </h1>
              <div className="flex gap-3 text-[12px] text-[#71717A] items-center">
                <p>1d</p>
                <p>1 like</p>
                <p>Reply</p>
                {user?._id === item.commentedUser._id ? (
                  <p data-testid="deleteModalBtn" onClick={() => setOpenDeleteCommentModal(true)}>
                    <Ellipsis />
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Heart strokeWidth={1} size={15} />
          </div>
          <DeleteCommentModal openDeleteCommentModal={openDeleteCommentModal} setOpenDeleteCommentModal={setOpenDeleteCommentModal} id={item?._id} refetch={refetch} />
        </div>
      ))}
    </div>
  );
};
