import { GetActiveStoriesDocument } from '@/generated';

export const mockStories = [
  {
    _id: 'story1',
    image: '/story1.png',
    createdAt: '2025-09-01T00:00:00Z',
    expiredAt: '2025-09-02T00:00:00Z',
    author: { _id: 'user1', userName: 'testuser1', profileImage: '/avatar1.png' },
    viewers: [],
  },
  {
    _id: 'story2',
    image: '/story2.png',
    createdAt: '2025-09-01T00:00:00Z',
    expiredAt: '2025-09-02T00:00:00Z',
    author: { _id: 'user1', userName: 'testuser1', profileImage: '/avatar1.png' },
    viewers: [],
  },
  {
    _id: 'story3',
    image: '/story3.png',
    createdAt: '2025-09-01T00:00:00Z',
    expiredAt: '2025-09-02T00:00:00Z',
    author: { _id: 'user2', userName: 'testuser2', profileImage: '/avatar2.png' },
    viewers: [],
  },
];

export const successMock = [{ request: { query: GetActiveStoriesDocument }, result: { data: { getActiveStories: mockStories } } }];

export const emptyMock = [{ request: { query: GetActiveStoriesDocument }, result: { data: { getActiveStories: [] } } }];

export const errorMock = [{ request: { query: GetActiveStoriesDocument }, error: new Error('GraphQL error') }];

export const mockWithNullAuthor = [
  {
    request: { query: GetActiveStoriesDocument },
    result: {
      data: {
        getActiveStories: [
          {
            _id: 'story1',
            image: '/story1.png',
            createdAt: '2025-09-01T00:00:00Z',
            expiredAt: '2025-09-02T00:00:00Z',
            author: null,
            viewers: [],
          },
          {
            _id: 'story2',
            image: '/story2.png',
            createdAt: '2025-09-01T00:00:00Z',
            expiredAt: '2025-09-02T00:00:00Z',
            author: { _id: 'user1', userName: 'validuser', profileImage: '/avatar1.png' },
            viewers: [],
          },
        ],
      },
    },
  },
];
