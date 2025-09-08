/*eslint-disable max-lines*/
import { render, screen } from '@testing-library/react';
import UserProfile from './page';
import '@testing-library/jest-dom';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));

// GraphQL query for posts (simplified version used in UserProfile)
const GET_POSTS_BY_AUTHOR_SIMPLE = gql`
  query GetPostsByAuthor($author: ID!) {
    getPostsByAuthor(author: $author) {
      _id
    }
  }
`;

// GraphQL query for posts (detailed version used in Posts component)
const GET_POSTS_BY_AUTHOR_DETAILED = gql`
  query GetPostsByAuthor($author: ID!) {
    getPostsByAuthor(author: $author) {
      _id
      image
      caption
      createdAt
      updatedAt
      author {
        _id
        userName
        profileImage
      }
      likes {
        _id
        userName
        profileImage
      }
      comments {
        _id
        content
        author
        likes {
          _id
          userName
          profileImage
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// Mock data for posts
const mockPosts = [
  {
    _id: 'post1',
    image: ['/post1.jpg'],
    caption: 'Test post 1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    author: {
      _id: 'user123',
      userName: 'travel.explorer',
      profileImage: '/profile.jpg',
    },
    likes: [
      { _id: 'like1', userName: 'user1', profileImage: '/user1.jpg' },
      { _id: 'like2', userName: 'user2', profileImage: '/user2.jpg' },
    ],
    comments: [
      {
        _id: 'comment1',
        content: 'Great post!',
        author: 'user1',
        likes: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ],
  },
  {
    _id: 'post2',
    image: ['/post2.jpg'],
    caption: 'Test post 2',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    author: {
      _id: 'user123',
      userName: 'travel.explorer',
      profileImage: '/profile.jpg',
    },
    likes: [
      { _id: 'like3', userName: 'user3', profileImage: '/user3.jpg' },
    ],
    comments: [],
  },
];

// Apollo Client mocks
const mocks = [
  {
    request: {
      query: GET_POSTS_BY_AUTHOR_SIMPLE,
      variables: { author: 'user123' },
    },
    result: {
      data: {
        getPostsByAuthor: mockPosts,
      },
    },
  },
  {
    request: {
      query: GET_POSTS_BY_AUTHOR_DETAILED,
      variables: { author: 'user123' },
    },
    result: {
      data: {
        getPostsByAuthor: mockPosts,
      },
    },
  },
];

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockUser = {
  _id: 'user123',
  userName: 'travel.explorer',
  fullName: 'Travel Explorer',
  bio: '📸 Travel Photographer',
  email: 'travel@example.com',
  profileImage: '/profile.jpg',
  isVerified: true,
  followers: [{ _id: 'f1', userName: 'follower1' }],
  followings: [{ _id: 'f2', userName: 'following1' }],
  posts: ['post1', 'post2'],
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  </AuthProvider>
);

describe('UserProfile', () => {
  beforeEach(() => {
    // Mock localStorage to return user data
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'mock-token';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders username and bio', () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    expect(screen.getByText('travel.explorer')).toBeInTheDocument();
    expect(screen.getByText('📸 Travel Photographer')).toBeInTheDocument();
  });

  it('renders posts count, followers, following', async () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    
    // Wait for the posts to load and check the actual count (2 posts from mock data)
    expect(await screen.findByText('2')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1 Followers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1 Followings/i })).toBeInTheDocument();
  });

  it('renders posts grid with images', async () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    
    // Wait for posts to load
    await screen.findByText('2');
    
    const posts = screen.getAllByRole('img');
    // Should have at least the profile image
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveAttribute('alt', 'travel.explorer profile picture');
  });
});
