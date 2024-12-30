'use client';
import { useGetPostLikesQuery } from '@/generated';
import React from 'react';

export const PostLikes = ({ id }: { id: string }) => {
  const { data } = useGetPostLikesQuery({
    variables: {
      postId: id,
    },
  });

  return (
    <p className="cursor-pointer">{data?.getPostLikes?.length === 0 ? '' : `${data?.getPostLikes?.length === 1 ? `${data?.getPostLikes?.length} like` : `${data?.getPostLikes?.length} likes`}`}</p>
  );
};
