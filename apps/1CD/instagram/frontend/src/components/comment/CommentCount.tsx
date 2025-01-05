'use client';
import { useGetCommentsQuery } from '@/generated';
import React from 'react';

export const CommentCount = ({ id }: { id: string }) => {
  const { data: commentsData } = useGetCommentsQuery({
    variables: {
      postId: id,
    },
  });

  return (
    <p className="cursor-pointer" data-testid="getcomment">
      {commentsData?.getComments?.length === 0 ? '' : `${commentsData?.getComments?.length === 1 ? `View comment` : `View all ${commentsData?.getComments?.length} comments`}`}
    </p>
  );
};
