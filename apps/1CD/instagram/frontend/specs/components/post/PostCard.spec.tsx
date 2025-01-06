// __tests__/PostCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';

import { useGetMyFollowingsPostsQuery } from '@/generated';
import { PostCard } from '@/components/post/PostCard';

// Mock the query
jest.mock('@/generated', () => ({
  useGetMyFollowingsPostsQuery: jest.fn(),
}));

describe('PostCard Component', () => {
  it('renders a loader when data is loading', () => {
    (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: true, data: null });

    render(
      <MockedProvider>
        <PostCard />
      </MockedProvider>
    );

    expect(screen.getByTestId('loader'))
  });

  it('renders the posts when data is available', () => {
    const mockData = {
      getMyFollowingsPosts: [
        {
          _id: '1',
          user: {
            userName: 'testuser',
            profileImg: '/images/profileImg.webp',
          },
          createdAt: new Date().toISOString(),
          description: 'This is a test post.',
          images: [],
        },
      ],
    };

    (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: false, data: mockData });

    render(
      <MockedProvider>
        <PostCard />
      </MockedProvider>
    );

    expect(screen.getByTestId('post-card'))
    expect(screen.getByText('testuser'))
    expect(screen.getByText('This is a test post.'))
  })
  it('renders the "More" button for each post', () => {
    const mockData = {
      getMyFollowingsPosts: [
        {
          _id: '1',
          user: {
            userName: 'testuser',
            profileImg: '/images/profileImg.webp',
          },
          createdAt: new Date().toISOString(),
          description: 'This is a test post.',
          images: [],
        },
      ],
    };

    (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: false, data: mockData });

    render(
      <MockedProvider>
        <PostCard />
      </MockedProvider>
    );

    expect(screen.getByTestId('more-btn'))
  });
});
