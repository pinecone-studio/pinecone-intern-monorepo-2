import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useCreatePostLikeMutation, useDeletePostLikeMutation, useGetPostLikeQuery, useGetPostLikesQuery } from '@/generated';
import { PostLike } from '@/components/like/PostLike';

jest.mock('@/generated', () => ({
  useCreatePostLikeMutation: jest.fn(),
  useDeletePostLikeMutation: jest.fn(),
  useGetPostLikeQuery: jest.fn(),
  useGetPostLikesQuery: jest.fn(),
}));

describe('PostLike Component', () => {
  const mockRefetch = jest.fn();
  const mockPostLikesRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles liking a post', async () => {
    const mockCreatePostLike = jest.fn().mockResolvedValue({});
    const mockDeletePostLike = jest.fn().mockResolvedValue({});

    (useCreatePostLikeMutation as jest.Mock).mockReturnValue([mockCreatePostLike]);
    (useDeletePostLikeMutation as jest.Mock).mockReturnValue([mockDeletePostLike]);
    (useGetPostLikeQuery as jest.Mock).mockReturnValue({
      data: {
        getPostLike: {
          isLike: false,
        },
      },
      refetch: mockRefetch,
    });
    (useGetPostLikesQuery as jest.Mock).mockReturnValue({
      refetch: mockPostLikesRefetch,
    });

    render(<PostLike id="123" />);

    const likeButton = screen.getByTestId('LikeBtn');
    fireEvent.click(likeButton);
  });

  it('handles unliking a post', async () => {
    const mockCreatePostLike = jest.fn().mockResolvedValue({});
    const mockDeletePostLike = jest.fn().mockResolvedValue({});

    (useCreatePostLikeMutation as jest.Mock).mockReturnValue([mockCreatePostLike]);
    (useDeletePostLikeMutation as jest.Mock).mockReturnValue([mockDeletePostLike]);
    (useGetPostLikeQuery as jest.Mock).mockReturnValue({
      data: {
        getPostLike: {
          isLike: true,
          _id: 'like123',
        },
      },
      refetch: mockRefetch,
    });
    (useGetPostLikesQuery as jest.Mock).mockReturnValue({
      refetch: mockPostLikesRefetch,
    });

    render(<PostLike id="123" />);

    const likeButton = screen.getByTestId('LikeBtn');
    fireEvent.click(likeButton);
  });
});
