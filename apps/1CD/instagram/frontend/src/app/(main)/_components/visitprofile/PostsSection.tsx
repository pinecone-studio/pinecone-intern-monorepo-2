'use client';
import React from 'react';

import { PostImgCard } from '@/app/(main)/_components/post/PostImgCard';
import { GetUserPostsQuery } from '@/generated';
import Image from 'next/image';

const PostsSection = ({ userPostData }: { userPostData: GetUserPostsQuery | undefined }) => {
  // const { data: userPostData } = useGetUserPostsQuery({
  //   variables: {
  //     user: id,
  //   },
  // });

  if (!userPostData || userPostData.getUserPosts?.length === 0)
    return (
      <>
        <div data-cy="zeroPost" className="flex flex-col items-center mt-32 space-y-8">
          <div className="flex flex-col items-center space-y-5">
            <section className="relative flex items-center justify-center w-20 h-20 border-2 border-black rounded-full">
              <Image src="/images/camera.png" alt="camera" width="50" height="50" />
            </section>
            <h1 className="text-5xl font-bold">No Posts Yet</h1>
          </div>
        </div>
      </>
    );

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
