export interface Story {
  id: string;
  src: string;
  duration: number;
}
export interface User {
  id: string;
  username: string;
  avatar: string;
  stories: Story[];
}
