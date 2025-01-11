'use client';
import { useCreateCommentLikeMutation, useDeleteCommentLikeMutation, useGetCommentLikeQuery, useGetCommentLikesQuery } from '@/generated';
import { Heart } from 'lucide-react';
import React from 'react';

export const CommentLike = ({ id }: { id: string }) => {
  const [createCommentLike] = useCreateCommentLikeMutation();
  const [deleteCommentLike] = useDeleteCommentLikeMutation();
  const { data, refetch } = useGetCommentLikeQuery({
    variables: {
      commentId: id,
    },
  });
  const { refetch: CommentLikesRefetch } = useGetCommentLikesQuery({
    variables: {
      commentId: id,
    },
  });

  const handleChangePostLike = async () => {
    if (!data?.getCommentLike?.isLike) {
      await createCommentLike({
        variables: {
          commentId: id,
          isLike: true,
        },
      });
      await refetch();
      await CommentLikesRefetch();
    }
    if (data?.getCommentLike?.isLike) {
      await deleteCommentLike({
        variables: {
          commentLikeId: data?.getCommentLike?._id,
        },
      });
      await refetch();
      await CommentLikesRefetch();
    }
  };

  return (
    <p className="cursor-pointer" onClick={handleChangePostLike} data-testid="LikeBtn">
      {data?.getCommentLike?.isLike ? <Heart fill="#FF0000" color="#FF0000" strokeWidth={1} size={15} /> : <Heart strokeWidth={1} size={15} />}
    </p>
  );
};
