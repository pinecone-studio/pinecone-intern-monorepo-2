import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetFollowingUserStoriesQuery } from '@/generated';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type PostType = {
  _id: string;
  user: {
    _id: string;
    userName: string;
    profileImg?: string | null;
  };
};

const SeeEachUserStory = ({ post }: { post: PostType }) => {
  const { data: userStories } = useGetFollowingUserStoriesQuery({
    variables: {
      user: post.user._id,
    },
  });

  const oneUserStories = userStories?.getFollowingUserStories.stories;

  if (!oneUserStories)
    return (
      <>
        <Link href={`/home/viewprofile/${post.user._id}`} className="flex items-center gap-2">
          <div className="relative flex rounded-full w-9 h-9">
            <Image fill={true} src={post?.user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="object-cover w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
          </div>
          <h1 className="flex items-center font-bold ">{post?.user?.userName}</h1>
        </Link>
      </>
    );

  return (
    <>
      {oneUserStories && (
        <Link href={`/userStories/${post.user._id}`}>
          <div className="rounded-full w-fit bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
              <Avatar className="w-9 h-9">
                <AvatarImage src={post.user.profileImg || '/images/profileImg.webp'} alt="Profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default SeeEachUserStory;
