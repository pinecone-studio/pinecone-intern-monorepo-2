import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useCreatePostLikeMutation, useDeletePostLikeMutation, useGetCommentsQuery, useGetPostByPostIdQuery, useGetPostLikeQuery, useGetPostLikesQuery, useUpdatePostMutation } from '@/generated';
import { PostImgCard } from '@/components/visit-profile/PostImgCard';
import { useAuth } from '@/components/providers';

jest.mock('@/generated', () => ({
  useGetPostByPostIdQuery: jest.fn(),
  useGetCommentsQuery: jest.fn(),
  useCreatePostLikeMutation: jest.fn(),
  useDeletePostLikeMutation: jest.fn(),
  useGetPostLikeQuery: jest.fn(),
  useGetPostLikesQuery: jest.fn(),
  useUpdatePostMutation: jest.fn(),
}));
jest.mock('@/components/providers', () => ({
  useAuth: jest.fn(),
}));

describe('PostWithComments Component', () => {
  const setOpenUpdateModal = jest.fn();
  const setClose = jest.fn();
  const mockAuthData = {
    user: { _id: '1', userName: 'Test User' },
  };
  const mockAuthDataNoId = {
    user: {},
  };
  const mockPostData = {
    getPostByPostId: {
      images: ['/image1.jpg', '/image2.jpg'],
      user: {
        profileImg: '/profile.jpg',
        userName: 'Test User',
        _id: '1',
      },
      description: 'This is a test post',
    },
  };
  const mockCommentData = {
    getComments: [
      {
        _id: 'comment1',
        postId: '123',
        commentText: 'Wooow amjilt',
        commentedUser: {
          _id: 'user1',
          userName: 'B190_$',
          fullName: 'Bilgun',
        },
      },
    ],
  };
  const mockRefetch = jest.fn();
  const mockPostLikesRefetch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly when data is provided', async () => {
    (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
      data: mockPostData,
    });
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: mockCommentData,
    });
    const mockCreatePostLike = jest.fn().mockResolvedValue({});
    const mockDeletePostLike = jest.fn().mockResolvedValue({});
    const mockUpdatePost = jest.fn().mockResolvedValue({});
    (useCreatePostLikeMutation as jest.Mock).mockReturnValue([mockCreatePostLike]);
    (useDeletePostLikeMutation as jest.Mock).mockReturnValue([mockDeletePostLike]);
    (setOpenUpdateModal as jest.Mock).mockReturnValue(true);
    (setClose as jest.Mock).mockReturnValue(false);

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
    (useUpdatePostMutation as jest.Mock).mockReturnValue([mockUpdatePost]);
    (useAuth as jest.Mock).mockReturnValue(mockAuthDataNoId);
    render(<PostImgCard id="123" image="/image1.jpg" />);
    const triggerButton = screen.getByTestId('open-comment-btn');
    fireEvent.click(triggerButton);
    await waitFor(() => expect(screen.getByTestId('postSection')));
  });
  it('renders correctly when data is provided', () => {
    (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
      data: mockPostData,
    });
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: mockCommentData,
    });

    const mockCreatePostLike = jest.fn().mockResolvedValue({});
    const mockDeletePostLike = jest.fn().mockResolvedValue({});
    const mockUpdatePost = jest.fn().mockResolvedValue({});
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
    (useUpdatePostMutation as jest.Mock).mockReturnValue([mockUpdatePost]);
    (useAuth as jest.Mock).mockReturnValue(mockAuthData);
    render(<PostImgCard id="123" image="/image1.jpg" />);
    const triggerButton = screen.getByTestId('open-comment-btn');
    fireEvent.click(triggerButton);
  });
  it('renders fallback UI when no data is available', () => {
    (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
      data: null,
    });
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: null,
    });
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
    (useAuth as jest.Mock).mockReturnValue(mockAuthData);
    render(<PostImgCard id="123" image="/image1.jpg" />);
    const triggerButton = screen.getByTestId('open-comment-btn');
    fireEvent.click(triggerButton);
    screen.queryByText('No data available');
  });
  it('renders skeleton or loading state while loading', () => {
    (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
      loading: true,
    });
    render(<PostImgCard id="123" image="/image1.jpg" />);
    screen.getByTestId('open-comment-btn');
    screen.queryByText('Loading...');
  });
});
