'use client';
import React from 'react';

import { PostImgCard } from '@/app/(main)/_components/post/PostImgCard';
import { GetUserPostsQuery } from '@/generated';

const PostsSection = ({ userPostData }: { userPostData: GetUserPostsQuery | undefined }) => {
  // const { data: userPostData } = useGetUserPostsQuery({
  //   variables: {
  //     user: id,
  //   },
  // });
  return (
    <div className="grid grid-cols-3 gap-3 " data-cy="userPosts" data-testid="userPosts">
      {userPostData?.getUserPosts?.map((myOnePost) => (
        <section key={myOnePost?._id} className="relative h-[292px] cursor-pointer" data-testid="userPost">
          <PostImgCard image={myOnePost?.images[0] || ''} id={myOnePost?._id || ''} />
        </section>
      ))}
    </div>
  );
};

export default PostsSection;
