'use client';
import { UserBar } from '@/app/(main)/_components/header/UserBar';
import { PostCard } from '../(main)/_components/post/PostCard';
import { useGetAllUsersWithLatestStoriesQuery, useGetMyActiveStoriesQuery, useGetMyFollowingsPostsQuery } from '@/generated';
import MainPageStory from '../(main)/_components/story/MainPageStory';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../(main)/_components/story/CarouselStyle';
import { useEffect } from 'react';
import { PostSkeleton, StoryLoadingSkeleton } from './Skeleton';

const Page = () => {
  const { data: postData, loading: postLoading } = useGetMyFollowingsPostsQuery();
  const { data: latestStories, loading: storyLoading } = useGetAllUsersWithLatestStoriesQuery();
  const allStories = latestStories?.getAllUsersWithLatestStories.map((data) => ({
    user: data.user,
    stories: data.stories,
    _id: data._id,
  }));

  const { data: myOwnStories, refetch } = useGetMyActiveStoriesQuery();
  const myStories = myOwnStories?.getMyActiveStories?.stories;

  const refresh = async () => {
    await refetch();
  };

  useEffect(() => {
    refresh();
  }, [myStories]);

  return (
    <>
      <div className="flex flex-col items-start justify-between w-full gap-6 px-6 lg:flex-row lg:gap-20 lg:justify-center sm:px-10">
        <div className="w-full lg:w-[40vw] flex flex-col gap-10 mt-4">
          <div className="mb-4">
            {storyLoading && <StoryLoadingSkeleton />}
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {allStories?.map((story, index) => (
                  <CarouselItem key={index} className="md:basis-[12%] lg:basis-[12.6%]">
                    <MainPageStory user={story.user} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className={`z-10 left-1 top-1/2 ${storyLoading && 'hidden'}`} />
              <CarouselNext className={`z-10 right-1 top-1/2 ${storyLoading && 'hidden'}`} />
            </Carousel>
          </div>
          {postLoading && <PostSkeleton />}
          <PostCard postData={postData} />
        </div>
        <UserBar myStories={myStories} />
      </div>
    </>
  );
};

export default Page;
