'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetStoryByUserIdQuery } from '@/generated';
import { useState, useCallback } from 'react';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { StoryHeader } from '@/components/stories/StoryHeader';
import { StoryProgressBars } from '@/components/stories/StoryProgressBars';
import { StoryContent } from '@/components/stories/StoryContent';
import { StoryNavigation } from '@/components/stories/StoryNavigation';

const UserStory = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { data, loading, error } = useGetStoryByUserIdQuery({
    skip: !userId,
    variables: { author: userId },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = data?.getStoryByUserId || [];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/userProfile');
    }
  }, [currentIndex, stories.length, router]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleClose = useCallback(() => {
    router.push('/userProfile');
  }, [router]);

  const progress = useStoryProgress({
    storiesLength: stories.length,
    currentIndex,
    onNext: handleNext,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!stories.length) return <p>No stories found</p>;

  const currentStory = stories[currentIndex];

  return (
    <div className="w-full h-screen bg-[#18181b] flex flex-col items-center justify-center">
      <StoryHeader onClose={handleClose} />

      <div className="relative w-full max-w-[521px] aspect-[9/16] mx-auto">
        <StoryProgressBars storiesLength={stories.length} currentIndex={currentIndex} progress={progress} />

        <StoryContent story={currentStory} />

        <StoryNavigation onPrev={handlePrev} onNext={handleNext} />
      </div>
    </div>
  );
};

export default UserStory;
