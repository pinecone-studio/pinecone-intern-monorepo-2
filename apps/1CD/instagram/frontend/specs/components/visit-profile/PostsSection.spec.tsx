import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { GetUserPostsQuery } from '@/generated';
import PostsSection from '@/components/visit-profile/PostsSection';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('PostsSection', () => {
  const mockUserPostData: GetUserPostsQuery = {
    getUserPosts: [
      {
        _id: '1',
        user: '12',
        images: ['https://example.com/image1.jpg'],
      },
      {
        _id: '2',
        user: '12',
        images: ['https://example.com/image2.jpg'],
      },
    ],
  };

  test('renders posts when userPostData is provided', () => {
    render(<PostsSection userPostData={mockUserPostData} />);

    const posts = screen.getAllByTestId('userPost');
    expect(posts).toHaveLength(2);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  test('renders an empty grid when userPostData is undefined', () => {
    render(<PostsSection userPostData={undefined} />);

    const posts = screen.queryAllByTestId('userPost');
    expect(posts).toHaveLength(0);
  });

  test('renders an empty grid when getUserPosts is empty', () => {
    render(<PostsSection userPostData={{ getUserPosts: [] }} />);

    const posts = screen.queryAllByTestId('userPost');
    expect(posts).toHaveLength(0);
  });

  test('handles posts with missing images', () => {
    const incompleteData: GetUserPostsQuery = {
      getUserPosts: [
        {
          _id: '3',
          user: '12',
          images: [],
        },
      ],
    };

    render(<PostsSection userPostData={incompleteData} />);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '');
    expect(images[0]).toHaveAttribute('alt', 'postnii-zurag');
  });
});
