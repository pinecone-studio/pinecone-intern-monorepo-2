'use client';
import { useCreatePostLikeMutation, useDeletePostLikeMutation, useGetPostLikeQuery, useGetPostLikesQuery } from '@/generated';
import { Heart } from 'lucide-react';
import React from 'react';

export const PostLike = ({ id }: { id: string }) => {
  const [createPostLike] = useCreatePostLikeMutation();
  const [deletePostLike] = useDeletePostLikeMutation();
  const { data, refetch } = useGetPostLikeQuery({
    variables: {
      postId: id,
    },
  });
  const { refetch: PostLikesRefetch } = useGetPostLikesQuery({
    variables: {
      postId: id,
    },
  });

  const handleChangePostLike = async () => {
    if (!data?.getPostLike?.isLike) {
      await createPostLike({
        variables: {
          postId: id,
          isLike: true,
        },
      });
      await refetch();
      await PostLikesRefetch();
    }
    if (data?.getPostLike?.isLike) {
      await deletePostLike({
        variables: {
          postLikeId: data?.getPostLike?._id,
        },
      });
      await refetch();
      await PostLikesRefetch();
    }
  };

  return (
    <p className="cursor-pointer" onClick={handleChangePostLike} data-testid="LikeBtn">
      {data?.getPostLike?.isLike ? <Heart fill="#FF0000" color="#FF0000" /> : <Heart />}
    </p>
  );
};
