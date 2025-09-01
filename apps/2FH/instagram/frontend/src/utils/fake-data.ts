import { demoImage } from '@/components/userProfile/mock-images';

export interface Story {
  id: number;
  username: string;
  avatar: string;
  hasStory: boolean;
}

export interface Suggestion {
  id: number;
  username: string;
  description: string;
  avatar: string;
}

export interface Post {
  id: number;
  username: string;
  timeAgo: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
}

export const stories: Story[] = [
  { id: 1, username: 'defavours', avatar: demoImage, hasStory: true },
  { id: 2, username: 'travel_lover', avatar: demoImage, hasStory: true },
  { id: 3, username: 'foodie_paradise', avatar: demoImage, hasStory: true },
  { id: 4, username: 'fitness_motivation', avatar: demoImage, hasStory: true },
  { id: 5, username: 'art_creations', avatar: demoImage, hasStory: true },
  { id: 6, username: 'music_vibes', avatar: demoImage, hasStory: true },
  { id: 7, username: 'fashion_style', avatar: demoImage, hasStory: true },
  { id: 8, username: 'tech_news', avatar: demoImage, hasStory: true },
];

export const suggestions: Suggestion[] = [
  {
    id: 1,
    username: 'travel_lover',
    description: 'Followed by user123',
    avatar: demoImage,
  },
  {
    id: 2,
    username: 'foodie_paradise',
    description: 'Followed by user456',
    avatar: demoImage,
  },
  {
    id: 3,
    username: 'fitness_motivation',
    description: 'Followed by user789',
    avatar: demoImage,
  },
  {
    id: 4,
    username: 'art_creations',
    description: 'Followed by user101',
    avatar: demoImage,
  },
  {
    id: 5,
    username: 'music_vibes',
    description: 'Followed by user202',
    avatar: demoImage,
  },
];

export const posts: Post[] = [
  {
    id: 1,
    username: 'defavours',
    timeAgo: '2 hours ago',
    image: demoImage,
    likes: 1234,
    caption: 'Amazing sunset view! 🌅',
    comments: 89,
  },
  {
    id: 2,
    username: 'travel_lover',
    timeAgo: '4 hours ago',
    image: demoImage,
    likes: 856,
    caption: 'Exploring new places ✈️',
    comments: 45,
  },
  {
    id: 3,
    username: 'foodie_paradise',
    timeAgo: '6 hours ago',
    image: demoImage,
    likes: 2341,
    caption: 'Delicious homemade pasta 🍝',
    comments: 156,
  },
  {
    id: 4,
    username: 'fitness_motivation',
    timeAgo: '8 hours ago',
    image: demoImage,
    likes: 567,
    caption: 'Morning workout complete! 💪',
    comments: 23,
  },
  {
    id: 5,
    username: 'art_creations',
    timeAgo: '10 hours ago',
    image: demoImage,
    likes: 1892,
    caption: 'New painting in progress 🎨',
    comments: 78,
  },
];
