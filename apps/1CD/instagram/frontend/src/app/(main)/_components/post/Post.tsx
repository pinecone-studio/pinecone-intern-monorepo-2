/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark, Dot, Loader, MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetFollowingUserStoriesLazyQuery, useGetMyFollowingsPostsQuery } from '@/generated';
import { PostLike } from '@/components/like/PostLike';
import { formatDistanceToNowStrict } from 'date-fns';
import { PostLikes } from '@/app/(main)/_components/like/PostLikes';
import { PostImg } from '@/components/post/PostImgCarousel';
import { PostWithComments } from '@/components/post/PostWithComments';
import { LastCommentCard } from '@/components/comment/LastCommentCard';
import { CreateComment } from '@/components/comment/CreateComment';

type UserStories = {
  [userId: string]: { _id: string; createdAt: string; endDate: string; image: string }[];
};

export const PostCard = () => {
  const { data, loading, error: postsError } = useGetMyFollowingsPostsQuery();
  const [getUserStories, { data: oneUserAllStories, loading: userStoriesLoading, error: userStoriesError }] = useGetFollowingUserStoriesLazyQuery();
  const [userStories, setUserStories] = useState<UserStories>({});

  // Fetch stories for users in the followings posts
  useEffect(() => {
    if (data?.getMyFollowingsPosts) {
      data.getMyFollowingsPosts.forEach((post) => {
        console.log('Post Data:', post); // Debugging post structure
        if (post.user && post.user._id) {
          console.log(`Fetching stories for user ID: ${post.user._id}`);
          getUserStories({ variables: { user: post.user._id } });
        } else {
          console.log(`Invalid user data in post:`, post); // Log invalid post with no user
        }
      });
    }
  }, [data, getUserStories]);

  // Update user stories state when stories are fetched successfully
  useEffect(() => {
    if (oneUserAllStories?.getFollowingUserStories?.stories) {
      const userId = oneUserAllStories.getFollowingUserStories.user._id;
      console.log('Received stories for user ID:', userId);
      console.log('Stories data:', oneUserAllStories.getFollowingUserStories.stories);

      setUserStories((prevState) => ({
        ...prevState,
        [userId]: oneUserAllStories.getFollowingUserStories.stories,
      }));
    }
  }, [oneUserAllStories]);

  // Log GraphQL errors
  useEffect(() => {
    if (userStoriesError) {
      console.error('Error fetching user stories:', userStoriesError);
    }
    if (postsError) {
      console.error('Error fetching posts:', postsError);
    }
  }, [userStoriesError, postsError]);

  if (loading || userStoriesLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[300px]" data-testid="loader">
        <Loader className="text-2xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full md:px-[40px] px-5" data-testid="post-card">
      {data?.getMyFollowingsPosts.map((post) => {
        console.log('Checking user stories for post ID:', post?._id); // Debugging which post we are on
        const stories = (post.user && userStories[post.user._id]) || [];
        console.log('User Stories:', stories);

        return (
          <div key={post?._id} className="md:border-b-[1px] md:pb-5">
            <div className="flex items-center justify-between py-[12px]">
              <div className="flex items-center gap-[0.5px]">
                <div className="flex items-center gap-2">
                  {stories.length > 0 ? (
                    <Link href={`/userStories/${post.user._id}`}>
                      <div className="rounded-full w-fit bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
                        <div className="rounded-full bg-white w-[60px] h-[60px] flex items-center justify-center">
                          <Avatar className="w-[56px] h-[56px]">
                            <AvatarImage src={post.user.profileImg || '/images/profileImg.webp'} alt="Profile" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/home/viewprofile/${post.user._id}`}>
                      <div className="relative flex rounded-full w-9 h-9">
                        <Image fill={true} src={post?.user?.profileImg || '/images/profileImg.webp'} alt="Profile" className="object-cover w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
                      </div>
                    </Link>
                  )}
                  <h1 className="flex items-center font-bold">{post?.user?.userName}</h1>
                </div>
                <span className="flex items-center font-normal text-gray-600">
                  <Dot />
                  {formatDistanceToNowStrict(new Date(post?.createdAt))}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" data-testid="more-btn" className="w-8 h-8 p-0">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem data-testid="delete-btn" className="text-red-600">
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>Hide</DropdownMenuItem>
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <PostImg images={post?.images} />
            <div className="flex items-center justify-between px-1 py-3 text-xl">
              <div className="flex gap-3">
                <PostLike id={post?._id} />
                <MessageCircle />
              </div>
              <Bookmark />
            </div>
            <PostLikes id={post?._id} />
            <div>
              <h1 className="text-base font-normal text-gray-600">
                <span className="pr-1 font-bold text-black">{post.user.userName}</span>
                {post.description}
              </h1>
            </div>
            <PostWithComments id={post?._id} />
            <LastCommentCard id={post._id} />
            <CreateComment id={post._id} />
          </div>
        );
      })}
    </div>
  );
};
