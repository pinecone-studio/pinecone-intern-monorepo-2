import { mapStoriesToUsers } from '@/utils/stories';

// Mock the image utility
jest.mock('@/utils/image', () => ({
  getValidImageUrl: jest.fn((url: string | undefined, fallback: string) => {
    return url && (url.startsWith('http') || url.startsWith('/')) ? url : fallback;
  }),
}));

// Type for test data
type TestStory = {
  _id: string;
  image?: string;
  author?: {
    _id: string;
    userName?: string;
    profileImage?: string;
  } | null;
};

describe('stories utility', () => {
  describe('mapStoriesToUsers', () => {
    it('should return empty array when no stories provided', () => {
      const result = mapStoriesToUsers([]);
      expect(result).toEqual([]);
    });

    it('should filter out stories without author', () => {
      const stories: TestStory[] = [
        { _id: 'story1', image: 'image1.jpg', author: null },
        { _id: 'story2', image: 'image2.jpg', author: undefined },
        {
          _id: 'story3',
          image: 'image3.jpg',
          author: { _id: 'user1', userName: 'user1', profileImage: 'profile1.jpg' },
        },
      ];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user1');
      expect(result[0].stories).toHaveLength(1);
    });

    it('should filter out stories with author but no _id', () => {
      const stories: TestStory[] = [
        { _id: 'story1', image: 'image1.jpg', author: { _id: '', userName: 'user1' } },
        { _id: 'story2', image: 'image2.jpg', author: { userName: 'user2' } as TestStory['author'] },
      ];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toEqual([]);
    });

    it('should create user with default values when author data is missing', () => {
      const stories: TestStory[] = [{ _id: 'story1', image: 'image1.jpg', author: { _id: 'user1' } }];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'user1',
        username: 'Unknown User',
        avatar: '/default-avatar.png',
        stories: [{ id: 'story1', src: '/default-story.png', duration: 5000 }],
      });
    });

    it('should create user with complete author data', () => {
      const stories: TestStory[] = [
        {
          _id: 'story1',
          image: 'http://example.com/image1.jpg',
          author: { _id: 'user1', userName: 'john_doe', profileImage: 'http://example.com/profile1.jpg' },
        },
      ];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'user1',
        username: 'john_doe',
        avatar: 'http://example.com/profile1.jpg',
        stories: [{ id: 'story1', src: 'http://example.com/image1.jpg', duration: 5000 }],
      });
    });

    it('should group multiple stories by same user', () => {
      const stories: TestStory[] = [
        { _id: 'story1', image: 'image1.jpg', author: { _id: 'user1', userName: 'user1' } },
        { _id: 'story2', image: 'image2.jpg', author: { _id: 'user1', userName: 'user1' } },
        { _id: 'story3', image: 'image3.jpg', author: { _id: 'user2', userName: 'user2' } },
      ];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(2);
      const user1 = result.find((u) => u.id === 'user1');
      const user2 = result.find((u) => u.id === 'user2');
      expect(user1?.stories).toHaveLength(2);
      expect(user2?.stories).toHaveLength(1);
    });

    it('should handle stories with missing image', () => {
      const stories: TestStory[] = [{ _id: 'story1', author: { _id: 'user1', userName: 'user1' } }];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0].stories[0].src).toBe('/default-story.png');
    });

    it('should handle stories with missing profileImage', () => {
      const stories: TestStory[] = [{ _id: 'story1', image: 'image1.jpg', author: { _id: 'user1', userName: 'user1' } }];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0].avatar).toBe('/default-avatar.png');
    });

    it('should handle stories with empty string profileImage', () => {
      const stories: TestStory[] = [{ _id: 'story1', image: 'image1.jpg', author: { _id: 'user1', userName: 'user1', profileImage: '' } }];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0].avatar).toBe('/default-avatar.png');
    });

    it('should handle stories with empty string image', () => {
      const stories: TestStory[] = [{ _id: 'story1', image: '', author: { _id: 'user1', userName: 'user1', profileImage: 'profile1.jpg' } }];
      const result = mapStoriesToUsers(stories as Parameters<typeof mapStoriesToUsers>[0]);
      expect(result).toHaveLength(1);
      expect(result[0].stories[0].src).toBe('/default-story.png');
    });
  });
});
