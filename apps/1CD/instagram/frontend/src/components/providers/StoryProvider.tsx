'use client';
import { AccountVisibility, useGetFollowingStoriesQuery } from '@/generated';
import { createContext, PropsWithChildren, useContext } from 'react';

type StoryContextType = {
  allStoryData:
    | {
        _id: string;
        userId: {
          _id: string;
          accountVisibility: AccountVisibility;
          userName: string;
          profileImg?: string | null;
        };
        userStories?: Array<{
          story: {
            _id: string;
            createdAt?: Date | null;
            description?: string | null;
            endDate?: string | null;
            image?: string | null;
          };
        }> | null;
      }[]
    | null
    | undefined;
  allStories:
    | {
        userStories:
          | {
              story: {
                _id: string;
                createdAt?: Date | null;
                description?: string | null;
                endDate?: string | null;
                image?: string | null;
              };
            }[]
          | null
          | undefined;
        userId: {
          _id: string;
          accountVisibility: AccountVisibility;
          userName: string;
          profileImg?: string | null;
        };
      }[]
    | undefined;
  onlyStories:
    | ({
        userId: {
          __typename?: 'User';
          _id: string;
          accountVisibility: AccountVisibility;
          userName: string;
          profileImg?: string | null;
        };
        __typename?: 'OneStory';
        _id: string;
        createdAt?: Date | null;
        description?: string | null;
        endDate?: string | null;
        image?: string | null;
      } | null)[]
    | undefined;
  onlyUsers:
    | {
        __typename?: 'User';
        _id: string;
        accountVisibility: AccountVisibility;
        userName: string;
        profileImg?: string | null;
      }[]
    | undefined;
};

const StoryContext = createContext<StoryContextType>({} as StoryContextType);

export const StoryProvider = ({ children }: PropsWithChildren) => {
  const { data: fetchAllStoryData } = useGetFollowingStoriesQuery();
  if (!fetchAllStoryData) return null;

  const allStoryData = fetchAllStoryData.getFollowingStories;

  const allStories = allStoryData?.map((stories) => ({
    _id: stories._id,
    userStories: stories.userStories,
    userId: stories.userId,
  }));

  const onlyStories = allStories
    ?.map((story) => {
      const firstStory = story.userStories?.[0]?.story;
      if (firstStory) {
        return {
          ...firstStory,
          userId: story.userId,
        };
      }
      return null;
    })
    .filter(Boolean);

  const onlyUsers = allStories?.map((user) => ({
    ...user.userId,
  }));

  return <StoryContext.Provider value={{ allStoryData, allStories, onlyStories, onlyUsers }}>{children}</StoryContext.Provider>;
};

export const useStory = () => useContext(StoryContext);
