// Mock next/image to render normal img
// eslint-disable-next-line @next/next/no-img-element
/* eslint-disable max-lines-per-function, no-unused-vars ,max-params ,max-lines */
jest.mock('next/image', () => {
  const MockImage = (props: React.ComponentProps<'img'>) => <img {...props} alt={props.alt} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { Posts } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const GET_POSTS_BY_FOLLOWING_USERS = gql`
  query GetPostsByFollowingUsers {
    getPostsByFollowingUsers {
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

const mockPostsData = {
  getPostsByFollowingUsers: [
    {
      _id: '1',
      image: ['/demo.jpg'],
      caption: 'hello world',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date().toISOString(),
      author: {
        _id: 'user1',
        userName: 'john',
        profileImage: '/avatar.jpg',
      },
      likes: [
        { _id: 'like1', userName: 'user1', profileImage: '/avatar1.jpg' },
        { _id: 'like2', userName: 'user2', profileImage: '/avatar2.jpg' },
      ],
      comments: [
        { _id: 'comment1', content: 'Nice post!', author: 'user2', likes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { _id: 'comment2', content: 'Great!', author: 'user3', likes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    },
  ],
};

const mocks = [
  {
    request: {
      query: GET_POSTS_BY_FOLLOWING_USERS,
    },
    result: {
      data: mockPostsData,
    },
  },
];

// Helper function to render Posts with authentication
const renderPostsWithAuth = (mocks: any[], isAuthenticated = true) => {
  // Mock the useAuth hook with different authentication states
  (useAuth as jest.Mock).mockReturnValue({
    isAuthenticated,
    user: isAuthenticated ? { _id: 'user1', userName: 'testuser', email: 'test@example.com' } : null,
    token: isAuthenticated ? 'test-token' : null,
  });

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Posts />
    </MockedProvider>
  );
};

describe('Posts component', () => {
  it('shows login prompt when user is not authenticated', () => {
    renderPostsWithAuth([], false);
    
    expect(screen.getByText('Please log in to see posts')).toBeInTheDocument();
    expect(screen.getByText('Sign in to view posts from users you follow.')).toBeInTheDocument();
  });

  it('renders post content correctly when authenticated', async () => {
    renderPostsWithAuth(mocks, true);

    await waitFor(() => {
      expect(screen.getAllByText('john').length).toBeGreaterThan(0);
    });
    
    expect(screen.getByText(/hello world/)).toBeInTheDocument();
    expect(screen.getByText(/2 likes/)).toBeInTheDocument();
  });

  it('toggles like button color on click', async () => {
    renderPostsWithAuth(mocks, true);

    await waitFor(() => {
      expect(screen.getByTestId('heart-1')).toBeInTheDocument();
    });

    const heart = screen.getByTestId('heart-1');
    expect(heart).not.toHaveClass('text-red-500');
    fireEvent.click(heart);
    expect(heart).toHaveClass('text-red-500');
    fireEvent.click(heart);
    expect(heart).not.toHaveClass('text-red-500');
  });

  it('toggles bookmark fill on click', async () => {
    renderPostsWithAuth(mocks, true);

    await waitFor(() => {
      expect(screen.getByTestId('bookmark-1')).toBeInTheDocument();
    });

    const bookmark = screen.getByTestId('bookmark-1');
    expect(bookmark).not.toHaveClass('fill-current');
    fireEvent.click(bookmark);
    expect(bookmark).toHaveClass('fill-current');
    fireEvent.click(bookmark);
    expect(bookmark).not.toHaveClass('fill-current');
  });

  it('shows loading state initially when authenticated', () => {
    renderPostsWithAuth([], true);

    // Check for the loading spinner by its class
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('shows no posts message when no posts are available', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_POSTS_BY_FOLLOWING_USERS,
        },
        result: {
          data: { getPostsByFollowingUsers: [] },
        },
      },
    ];

    renderPostsWithAuth(emptyMocks, true);

    await waitFor(() => {
      expect(screen.getByText('No posts to show')).toBeInTheDocument();
      expect(screen.getByText('Follow some users to see their posts here.')).toBeInTheDocument();
    });
  });
});
