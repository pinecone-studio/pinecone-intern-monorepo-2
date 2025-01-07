'use client';
import { AccountVisibility, useGetFollowingStoriesQuery } from '@/generated';
import { createContext, PropsWithChildren, useContext } from 'react';

type StoryContextType = {
  storyData:
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
  oneUserStories:
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
};

const StoryContext = createContext<StoryContextType>({} as StoryContextType);

export const StoryProvider = ({ children }: PropsWithChildren) => {
  //   const { user } = useAuth();
  //   const userId = user?._id as string;

  const { data: fetchStoryData } = useGetFollowingStoriesQuery();
  if (!fetchStoryData) return;

  const storyData = fetchStoryData.getFollowingStories;

  const oneUserStories = storyData?.map((stories) => ({
    userStories: stories.userStories,
    userId: stories.userId,
  }));

  const singleData = oneUserStories?.map((story) => ({
    image: story?.userStories?.map((img) => img.story.image),
  }));

  console.log('sd', singleData);

  return <StoryContext.Provider value={{ storyData, oneUserStories }}>{children}</StoryContext.Provider>;
};

export const useStory = () => useContext(StoryContext);
