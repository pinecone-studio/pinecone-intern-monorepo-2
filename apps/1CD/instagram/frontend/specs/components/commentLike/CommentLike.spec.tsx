import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useCreateCommentLikeMutation, useDeleteCommentLikeMutation, useGetCommentLikeQuery, useGetCommentLikesQuery } from '@/generated';
import { CommentLike } from '@/components/comment-like/CommentLike';

jest.mock('@/generated', () => ({
  useCreateCommentLikeMutation: jest.fn(),
  useDeleteCommentLikeMutation: jest.fn(),
  useGetCommentLikeQuery: jest.fn(),
  useGetCommentLikesQuery: jest.fn(),
}));

describe('PostLike Component', () => {
  const mockRefetch = jest.fn();
  const mockCommentLikesRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles liking a comment', async () => {
    const mockCreateCommentLike = jest.fn().mockResolvedValue({});
    const mockDeleteCommentLike = jest.fn().mockResolvedValue({});

    (useCreateCommentLikeMutation as jest.Mock).mockReturnValue([mockCreateCommentLike]);
    (useDeleteCommentLikeMutation as jest.Mock).mockReturnValue([mockDeleteCommentLike]);
    (useGetCommentLikeQuery as jest.Mock).mockReturnValue({
      data: {
        getCommentLike: {
          isLike: false,
        },
      },
      refetch: mockRefetch,
    });
    (useGetCommentLikesQuery as jest.Mock).mockReturnValue({
      refetch: mockCommentLikesRefetch,
    });

    render(<CommentLike id="123" />);

    const likeButton = screen.getByTestId('LikeBtn');
    fireEvent.click(likeButton);
  });

  it('handles unliking a comment', async () => {
    const mockCreateCommentLike = jest.fn().mockResolvedValue({});
    const mockDeleteCommentLike = jest.fn().mockResolvedValue({});

    (useCreateCommentLikeMutation as jest.Mock).mockReturnValue([mockCreateCommentLike]);
    (useDeleteCommentLikeMutation as jest.Mock).mockReturnValue([mockDeleteCommentLike]);
    (useGetCommentLikeQuery as jest.Mock).mockReturnValue({
      data: {
        getCommentLike: {
          isLike: true,
          _id: 'like123',
        },
      },
      refetch: mockRefetch,
    });
    (useGetCommentLikesQuery as jest.Mock).mockReturnValue({
      refetch: mockCommentLikesRefetch,
    });

    render(<CommentLike id="123" />);

    const likeButton = screen.getByTestId('LikeBtn');
    fireEvent.click(likeButton);
  });
});
