import { User, Story } from '@/app/Types/story.types';
import { getValidImageUrl } from './image';

type RawStory = {
  _id: string;
  image?: string;
  author?: {
    _id: string;
    userName?: string;
    profileImage?: string;
  };
};

const createUserFromStory = (story: RawStory): User => ({
  id: story.author?._id as string,
  username: story.author?.userName || 'Unknown User',
  avatar: getValidImageUrl(story.author?.profileImage || '', '/default-avatar.png'),
  stories: [],
});

const createStoryFromRaw = (story: RawStory): Story => ({
  id: story._id,
  src: getValidImageUrl(story.image, '/default-story.png'),
  duration: 5000,
});

export const mapStoriesToUsers = (stories: RawStory[]): User[] => {
  return stories.reduce((acc: User[], story) => {
    if (!story.author?._id) return acc;

    let user = acc.find((u: User) => u.id === story.author?._id);
    if (!user) {
      user = createUserFromStory(story);
      acc.push(user);
    }

    user.stories.push(createStoryFromRaw(story));
    return acc;
  }, []);
};
