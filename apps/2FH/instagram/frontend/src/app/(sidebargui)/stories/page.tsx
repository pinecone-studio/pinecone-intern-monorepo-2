'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetActiveStoriesQuery } from '@/generated';
import StoryViewer from '@/components/stories/StoryViewer';
import { Story, User } from '@/app/Types/story.types';
import { mapStoriesToUsers } from '@/utils/stories';

const Stories: React.FC = () => {
  const router = useRouter();
  const { data, loading, error } = useGetActiveStoriesQuery({ fetchPolicy: 'cache-and-network' });
  const [currentUser, setCurrentUser] = useState<number>(0);
  const [currentStory, setCurrentStory] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const users = useMemo(
    () =>
      mapStoriesToUsers(
        data?.getActiveStories
          ?.filter((story): story is typeof story & { author: NonNullable<typeof story.author> } => story.author !== null)
          .map((story) => ({
            ...story,
            author: {
              ...story.author,
              profileImage: story.author.profileImage ?? undefined,
            },
          })) || []
      ),
    [data?.getActiveStories]
  );
  const story: Story | undefined = users[currentUser]?.stories?.[currentStory];
  const handleNextUser = useCallback(() => {
    if (currentUser < users.length - 1) {
      setCurrentUser((p) => p + 1);
      setCurrentStory(0);
    } else {
      router.push('/');
    }
  }, [currentUser, users.length, router]);
  const handleNextStory = useCallback(() => {
    if (!story || !users[currentUser]) return;
    const hasMoreStories = currentStory < users[currentUser].stories.length - 1;
    hasMoreStories ? setCurrentStory((p) => p + 1) : handleNextUser();
  }, [story, currentUser, currentStory, users, handleNextUser]);

  const handlePrevUser = () => {
    if (currentUser > 0) {
      const prevIdx = currentUser - 1;
      setCurrentUser(prevIdx);
      setCurrentStory(users[prevIdx]?.stories?.length - 1 || 0);
    }
  };

  const handlePrevStory = () => (currentStory > 0 ? setCurrentStory((p) => p - 1) : handlePrevUser());

  const handleUserSelect = (user: User) => {
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      setCurrentUser(idx);
      setCurrentStory(0);
    }
  };

  const visibleUsers = useMemo(() => {
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => users[currentUser + offset]).filter((u): u is User => !!u);
  }, [currentUser, users]);

  const handleStoryComplete = useCallback(() => {
    const isLastStory = currentStory >= users[currentUser]?.stories?.length - 1;
    const isLastUser = currentUser >= users.length - 1;

    if (isLastStory && isLastUser) {
      router.push('/');
      return;
    }
    if (isLastStory) {
      setCurrentUser((p) => p + 0.5);
      setCurrentStory(0);
    } else {
      setCurrentStory((p) => p + 0.5);
    }
  }, [currentStory, currentUser, users, router]);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          handleStoryComplete();
          return 0;
        }
        return p + 2;
      });
    }, story.duration / 50);
    return () => clearInterval(interval);
  }, [story?.id, story?.duration, handleStoryComplete]);

  if (loading) {
    return (
      <div data-testid="loading-stories" className="text-white p-4">
        Loading stories...
      </div>
    );
  }
  if (error) {
    return (
      <div data-testid="error-stories" className="text-red-500 p-4">
        Error: {error.message}
      </div>
    );
  }
  if (!users.length) {
    return (
      <div data-testid="no-stories" className="text-white p-4">
        <div className="flex justify-between items-center">
          <p>No stories available</p>
          <button data-testid="close-stories-btn" onClick={() => router.push('/')}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  const currentUserData = users[currentUser];

  return (
    <div data-testid="stories-container" className="w-full h-screen bg-[#18181b] flex flex-col items-center">
      <div className="w-full flex justify-between items-center p-4 text-white">
        <p className="text-lg">Instagram</p>
        <button data-testid="close-stories-btn" onClick={() => router.push('/')} className="hover:bg-gray-700 p-2 rounded text-xl">
          ✕
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-6 ">
        {visibleUsers.map((user) => (
          <div key={user.id} className="transition-all duration-300">
            <StoryViewer
              user={user}
              story={user.id === currentUserData?.id ? story : undefined}
              currentStory={user.id === currentUserData?.id ? currentStory : 0}
              progress={user.id === currentUserData?.id ? progress : 0}
              onPrevStory={handlePrevStory}
              onNextStory={handleNextStory}
              onPrevUser={handlePrevUser}
              onNextUser={handleNextUser}
              canGoPrev={currentUser > 0}
              isActive={user.id === currentUserData?.id}
              onUserSelect={() => handleUserSelect(user)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
