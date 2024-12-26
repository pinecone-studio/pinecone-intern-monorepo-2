'use client';
import { useCreatePostLikeMutation, useDeletePostLikeMutation, useGetPostLikesQuery } from '@/generated';
import { Heart } from 'lucide-react';
import React from 'react';

export const PostLike = ({ id }: { id: string }) => {
  const [createPostLike] = useCreatePostLikeMutation();
  const [deletePostLike] = useDeletePostLikeMutation();
  const { data, refetch } = useGetPostLikesQuery({
    variables: {
      postId: id,
    },
  });

  const handleChangePostLike = async () => {
    if (!data?.getPostLikes[0]?.isLike) {
      await createPostLike({
        variables: {
          postId: id,
          isLike: true,
        },
      });
      await refetch();
    }
    if (data?.getPostLikes[0]?.isLike) {
      await deletePostLike({
        variables: {
          postLikeId: data?.getPostLikes[0]?._id,
        },
      });
      await refetch();
    }
  };

  return (
    <p className="cursor-pointer" onClick={handleChangePostLike} data-testid="LikeBtn">
      {data?.getPostLikes[0]?.isLike ? <Heart fill="111" /> : <Heart />}
    </p>
  );
};
