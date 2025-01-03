'use client';
import { useGetCommentsQuery } from '@/generated';
import React from 'react';

export const LastCommentCard = ({ id }: { id: string }) => {
  const { data } = useGetCommentsQuery({
    variables: {
      postId: id,
    },
  });

  return (
    <div className="">
      {data?.getComments.slice(-2).map((item) => (
        <div key={item?._id} className="flex items-start gap-2 py-1">
          <h1 className="text-sm font-bold text-black">
            {item?.commentedUser?.userName}
            <span className="pl-1 text-sm font-normal text-black text-wrap">{item?.commentText}</span>
          </h1>
        </div>
      ))}
    </div>
  );
};
