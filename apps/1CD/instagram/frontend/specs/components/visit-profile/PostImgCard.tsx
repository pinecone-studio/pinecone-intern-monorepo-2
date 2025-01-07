// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import {
//   useCreatePostLikeMutation,
//   useDeletePostLikeMutation,
//   useDeletePostMutation,
//   useGetCommentsQuery,
//   useGetPostByPostIdQuery,
//   useGetPostLikeQuery,
//   useGetPostLikesQuery,
//   useUpdatePostMutation,
// } from '@/generated';
// import { PostImgCard } from '@/app/(main)/_components/PostImgCard';
// import { useAuth } from '@/components/providers';

// jest.mock('@/generated', () => ({
//   useGetPostByPostIdQuery: jest.fn(),
//   useGetCommentsQuery: jest.fn(),
//   useCreatePostLikeMutation: jest.fn(),
//   useDeletePostLikeMutation: jest.fn(),
//   useGetPostLikeQuery: jest.fn(),
//   useGetPostLikesQuery: jest.fn(),
//   useUpdatePostMutation: jest.fn(),
//   useDeletePostMutation: jest.fn(),
// }));
// jest.mock('@/components/providers', () => ({
//   useAuth: jest.fn(),
// }));

// describe('PostWithComments Component', () => {
//   const mockAuthData = {
//     user: { _id: '1', userName: 'Test User' },
//   };

//   const mockRefetch = jest.fn();
//   const mockPostLikesRefetch = jest.fn();
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders fallback UI when no data is available', () => {
//     (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
//       data: null,
//     });
//     (useGetCommentsQuery as jest.Mock).mockReturnValue({
//       data: null,
//     });
//     const mockCreatePostLike = jest.fn().mockResolvedValue({});
//     const mockDeletePostLike = jest.fn().mockResolvedValue({});
//     const mockUpdatePost = jest.fn().mockResolvedValue({});
//     const mockDeletePost = jest.fn().mockResolvedValue({});
//     (useCreatePostLikeMutation as jest.Mock).mockReturnValue([mockCreatePostLike]);
//     (useDeletePostLikeMutation as jest.Mock).mockReturnValue([mockDeletePostLike]);

//     (useDeletePostMutation as jest.Mock).mockReturnValue([
//       mockDeletePost,
//       {
//         loading: true,
//       },
//     ]);
//     (useUpdatePostMutation as jest.Mock).mockReturnValue([mockUpdatePost]);
//     (useGetPostLikeQuery as jest.Mock).mockReturnValue({
//       data: {
//         getPostLike: {
//           isLike: false,
//         },
//       },
//       refetch: mockRefetch,
//     });
//     (useGetPostLikesQuery as jest.Mock).mockReturnValue({
//       refetch: mockPostLikesRefetch,
//     });

//     (useAuth as jest.Mock).mockReturnValue(mockAuthData);
//     render(<PostImgCard id="123" image="/image1.jpg" />);
//     const triggerButton = screen.getByTestId('open-comment-btn');
//     fireEvent.keyDown(triggerButton, { key: 'Enter' });
//     // fireEvent.click(triggerButton);
//     screen.queryByText('No data available');
//   });
//   it('renders skeleton or loading state while loading', () => {
//     (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
//       loading: true,
//     });

//     render(<PostImgCard id="123" image="/image1.jpg" />);
//     screen.getByTestId('open-comment-btn');
//     screen.queryByText('Loading...');
//   });
//   it('renders skeleton or loading state while loading deletepost', () => {
//     const mockDeletePost = jest.fn().mockResolvedValue({});
//     (useDeletePostMutation as jest.Mock).mockReturnValue([
//       mockDeletePost,
//       {
//         loading: true,
//       },
//     ]);
//     render(<PostImgCard id="123" image="/image1.jpg" />);
//     // screen.getByTestId('open-delete-modal');
//     screen.queryByText('Loading ...');
//   });
// });
