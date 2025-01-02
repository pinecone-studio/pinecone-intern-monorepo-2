import React from 'react';
import Image from 'next/image';
import { GetUserPostsQuery } from '@/generated';

const PostsSection = ({ userPostData }: { userPostData: GetUserPostsQuery | undefined }) => {
  //   if (userPostData?.getUserPosts?.length)
  return (
    <div className="grid grid-cols-3 gap-3 " data-cy="userPosts">
      {userPostData?.getUserPosts?.map((myOnePost) => (
        <section key={myOnePost?._id} className="relative h-[292px]" data-testid="userPost">
          <Image src={myOnePost?.images[0] || ''} alt="postnii-zurag" fill className="absolute object-cover" />
        </section>
      ))}
    </div>
  );
  //   else return <NoPost data-cy="zeroPost" />;
};

export default PostsSection;
