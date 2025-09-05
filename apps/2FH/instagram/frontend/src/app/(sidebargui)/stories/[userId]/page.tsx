'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetActiveStoriesQuery } from '@/generated';
import StoryViewer from '@/components/stories/StoryViewer';
import { Story, User } from '@/app/Types/story.types';
import { mapStoriesToUsers } from '@/utils/stories';
const UserStories: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { data, loading, error } = useGetActiveStoriesQuery({ fetchPolicy: 'cache-and-network' });
  const [currentUser, setCurrentUser] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const users = useMemo(() => {
    if (!data?.getActiveStories) return [];
    return mapStoriesToUsers(
      data.getActiveStories
        .filter((story): story is typeof story & { author: NonNullable<typeof story.author> } => story.author !== null)
        .map((story) => ({
          ...story,
          author: {
            ...story.author,
            profileImage: story.author.profileImage ?? undefined,
          },
        }))
    );
  }, [data?.getActiveStories]);
  useEffect(() => {
    if (users.length > 0 && userId) {
      const targetUserIndex = users.findIndex((user) => user.id === userId);
      if (targetUserIndex !== -1) {
        setCurrentUser(targetUserIndex);
        setCurrentStory(0);
      }
    }
  }, [users, userId]);
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
    if (currentStory < users[currentUser].stories.length - 1) {
      setCurrentStory((p) => p + 1);
    } else {
      handleNextUser();
    }
  }, [story, currentStory, currentUser, users, handleNextUser]);
  const handlePrevUser = useCallback(() => {
    if (currentUser > 0) {
      const prevIdx = currentUser - 1;
      setCurrentUser(prevIdx);
      setCurrentStory(users[prevIdx]?.stories?.length - 1 || 0);
    }
  }, [currentUser, users]);
  const handlePrevStory = useCallback(() => {
    if (currentStory > 0) {
      setCurrentStory((p) => p - 1);
    } else {
      handlePrevUser();
    }
  }, [currentStory, handlePrevUser]);
  const handleUserSelect = useCallback(
    (user: User) => {
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        setCurrentUser(idx);
        setCurrentStory(0);
      }
    },
    [users]
  );
  const visibleUsers = useMemo(() => {
    const visible: User[] = [];
    [-2, -1, 0, 1, 2].forEach((offset) => {
      const idx = currentUser + offset;
      if (idx >= 0 && idx < users.length) visible.push(users[idx]);
    });
    return visible;
  }, [currentUser, users]);
  const handleStoryComplete = useCallback(() => {
    const isLastStory = currentStory >= users[currentUser]?.stories?.length - 1;
    const isLastUser = currentUser >= users.length - 1;
    if (isLastStory) {
      if (isLastUser) {
        router.push('/');
      } else {
        setCurrentUser((p) => p + 0.5);
        setCurrentStory(0);
      }
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
  }, [story, handleStoryComplete]);
  if (loading) return <div data-testid="loading-stories">Loading stories...</div>;
  if (error) return <div data-testid="error-stories">Error: {error.message}</div>;
  if (!users.length)
    return (
      <div data-testid="no-stories">
        <button data-testid="close-stories-btn" onClick={() => router.push('/')}>
          ✕
        </button>
        No stories available
      </div>
    );
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
          <div key={user.id} data-testid={`story-viewer-${user.id}`}>
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
export default UserStories;
