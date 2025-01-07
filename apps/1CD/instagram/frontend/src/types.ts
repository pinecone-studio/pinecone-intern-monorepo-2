import { AccountVisibility } from './generated';

export type oneUserStoriesType =
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

export type storyDataType =
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
