'use client';
import { UserBar } from '@/app/(main)/_components/header/UserBar';
import { PostCard } from '../(main)/_components/post/PostCard';
import { useGetAllUsersWithLatestStoriesQuery } from '@/generated';
import MainPageStory from '../(main)/_components/story/MainPageStory';

const Page = () => {
  const { data: latestStories } = useGetAllUsersWithLatestStoriesQuery();
  const allStories = latestStories?.getAllUsersWithLatestStories.map((data) => ({
    user: data.user,
    stories: data.stories,
    _id: data._id,
  }));

  return (
    <>
      <div className="flex flex-col items-start justify-between w-full gap-6 px-6 lg:flex-row lg:gap-20 lg:justify-center sm:px-10 ">
        <div className="w-full lg:w-[40vw] flex flex-col gap-10 mt-4">
          <div className="flex gap-4">
            {allStories?.map((story, i) => (
              <MainPageStory key={i} user={story.user} />
            ))}
          </div>
          <PostCard />
        </div>
        <UserBar />
      </div>
    </>
  );
};

export default Page;
