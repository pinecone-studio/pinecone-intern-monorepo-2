'use client';
import { UserBar } from '@/components/header/UserBar';
import NewStory from '@/app/(main)/_components/NewStory';
import { useEffect, useState } from 'react';
import { PostCard } from '../(main)/_components/PostCard';
import { useStory } from '@/components/providers/StoryProvider';

const Page = () => {
  const { onlyStories, onlyUsers } = useStory();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.8;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  console.log('progress', progress);

  return (
    <>
      <div className="flex flex-col items-start justify-between w-full gap-6 px-6 lg:flex-row lg:gap-20 lg:justify-center sm:px-10 ">
        <div className="w-full lg:w-[40vw] flex flex-col gap-10 mt-4">
          <div className="flex gap-4 px-8">
            {onlyStories?.map((story, i) => (
              <NewStory key={i} user={onlyUsers?.find((user) => user._id === story?.userId._id)} />
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
