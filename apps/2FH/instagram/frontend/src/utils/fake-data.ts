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
  { id: 1, username: 'defavours', avatar: '🍓', hasStory: true },
  { id: 2, username: 'defavours', avatar: '🍫', hasStory: true },
  { id: 3, username: 'defavours', avatar: '🍰', hasStory: true },
  { id: 4, username: 'defavours', avatar: '🍨', hasStory: true },
  { id: 5, username: 'defavours', avatar: '🧁', hasStory: true },
  { id: 6, username: 'defavours', avatar: '🍪', hasStory: true },
];

export const suggestions: Suggestion[] = [
  { id: 1, username: 'linktr', description: 'Follows you', avatar: '🌱' },
  { id: 2, username: 'baylejf', description: 'Followed by gphiemr', avatar: '👤' },
  { id: 3, username: 'wilfred30', description: 'Followed by gphiemr', avatar: '📸' },
  { id: 4, username: 'ghostly_dolls', description: 'Follows you', avatar: '👻' },
  { id: 5, username: 'n3g4t1v3_5p4c3', description: 'New to Instagram', avatar: '🎮' },
];

export const posts: Post[] = [
  {
    id: 1,
    username: 'defavours',
    timeAgo: '5h',
    image: 'https://carveyourcraving.com/wp-content/uploads/2021/06/chocolate-icecream-in-an-icecream-maker.jpg',
    likes: 741368,
    caption: '@defavours love these after a hard day of work. #missonsummer #strawberry is the best flavor',
    comments: 13394,
  }
]; 