// import React from 'react';
// import { render, screen } from '@testing-library/react';

// import {
//   useCreatePostLikeMutation,
//   useDeletePostLikeMutation,
//   useGetCommentsQuery,
//   useGetMyFollowingsPostsQuery,
//   useGetPostByPostIdQuery,
//   useGetPostLikeQuery,
//   useGetPostLikesQuery,
// } from '@/generated';
// import { PostCard } from '@/app/(main)/_components/PostCard';
// import { useAuth } from '@/components/providers';

// jest.mock('@/generated', () => ({
//   useGetMyFollowingsPostsQuery: jest.fn(),
//   useCreatePostLikeMutation: jest.fn(),
//   useDeletePostLikeMutation: jest.fn(),
//   useGetPostLikeQuery: jest.fn(),
//   useGetPostLikesQuery: jest.fn(),
//   useGetPostByPostIdQuery: jest.fn(),
//   useGetCommentsQuery: jest.fn(),
// }));
// jest.mock('@/components/providers', () => ({
//   useAuth: jest.fn(),
// }));
// describe('PostCard Component', () => {
//   const mockData = {
//     getMyFollowingsPosts: [
//       {
//         _id: '1',
//         user: {
//           userName: 'testuser',
//           profileImg: '/images/profileImg.webp',
//         },
//         createdAt: new Date().toISOString(),
//         description: 'This is a test post.',
//         images: ['/image1.jpg', '/image2.jpg'],
//       },
//       {
//         _id: '2',
//         user: {
//           userName: 'testuser',
//           profileImg: '/images/profileImg.webp',
//         },
//         createdAt: new Date().toISOString(),
//         description: 'This is a test post.',
//         images: ['/image1.jpg', '/image2.jpg'],
//       },
//     ],
//   };
//   const mockAuthData = {
//     user: { _id: '1', userName: 'Test User' },
//   };
//   const mockCommentData = {
//     getComments: [
//       {
//         _id: 'comment1',
//         postId: '123',
//         commentText: 'Wooow amjilt',
//         commentedUser: {
//           _id: 'user1',
//           userName: 'B190_$',
//           fullName: 'Bilgun',
//         },
//       },
//     ],
//   };
//   const mockRefetch = jest.fn();
//   const mockPostLikesRefetch = jest.fn();
//   const mockPostData = {
//     getPostByPostId: {
//       images: ['/image1.jpg', '/image2.jpg'],
//       user: {
//         profileImg: '/profile.jpg',
//         userName: 'testUser',
//       },
//       description: 'This is a test post',
//     },
//   };
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it('renders a loader when data is loading', () => {
//     (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: true, data: null });
//     render(<PostCard />);
//     expect(screen.getByTestId('loader'));
//   });
//   it('renders a loader when data is loading folloswing post', () => {
//     (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: true, data: mockData });
//     render(<PostCard />);

//     expect(screen.getByTestId('loader'));
//   });
//   it('renders the posts when data is available', () => {
//     (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ data: mockData });
//     const mockCreatePostLike = jest.fn().mockResolvedValue({});
//     const mockDeletePostLike = jest.fn().mockResolvedValue({});
//     (useCreatePostLikeMutation as jest.Mock).mockReturnValue([mockCreatePostLike]);
//     (useDeletePostLikeMutation as jest.Mock).mockReturnValue([mockDeletePostLike]);
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
//     (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
//       data: mockPostData,
//     });
//     (useGetCommentsQuery as jest.Mock).mockReturnValue({
//       data: mockCommentData,
//     });
//     (useAuth as jest.Mock).mockReturnValue(mockAuthData);
//     render(<PostCard />);
//     expect(screen.getByTestId('post-card'));
//     // expect(screen.getByText('testuser'));
//     // expect(screen.getByText('This is a test post.'));
//   });
//   it('renders the posts when data is available no profile image', () => {
//     const mockData1 = {
//       getMyFollowingsPosts: [
//         {
//           _id: '1',
//           user: {
//             userName: 'testuser',
//           },
//           createdAt: new Date().toISOString(),
//           description: 'This is a test post.',
//           images: [],
//         },
//       ],
//     };
//     (useGetMyFollowingsPostsQuery as jest.Mock).mockReturnValue({ loading: false, data: mockData1 });
//     render(<PostCard />);
//     expect(screen.getByTestId('post-card'));
//     // expect(screen.getByText('testuser'));
//     // expect(screen.getByText('This is a test post.'));
//   });
// });
