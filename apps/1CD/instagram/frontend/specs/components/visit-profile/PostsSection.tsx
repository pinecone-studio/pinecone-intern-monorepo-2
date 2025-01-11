// import { render, screen } from '@testing-library/react';
// import { useDeletePostMutation, useGetPostByPostIdQuery, useGetUserPostsQuery, useUpdatePostMutation } from '@/generated';
// import PostsSection from '@/components/visit-profile/PostsSection';

// jest.mock('@/generated', () => ({
//   useGetUserPostsQuery: jest.fn(),
//   useGetPostByPostIdQuery: jest.fn(),
//   useUpdatePostMutation: jest.fn(),
//   useDeletePostMutation: jest.fn(),
// }));

// describe('post section', () => {
//   const mockPostsData = {
//     getUserPosts: [null],
//   };
//   const mockPostData = {
//     getPostByPostId: {
//       images: ['/image1.jpg', '/image2.jpg'],
//       user: {
//         profileImg: '/profile.jpg',
//         userName: 'Test User',
//         _id: '1',
//       },
//       description: 'This is a test post',
//     },
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should render post section', async () => {
//     (useGetUserPostsQuery as jest.Mock).mockReturnValue({
//       data: mockPostsData,
//     });
//     const mockUpdatePost = jest.fn().mockResolvedValue({});
//     (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
//       data: mockPostData,
//     });
//     (useUpdatePostMutation as jest.Mock).mockReturnValue([mockUpdatePost]);
//     const mockDeletePost = jest.fn().mockResolvedValue({});
//     (useDeletePostMutation as jest.Mock).mockReturnValue([
//       mockDeletePost,
//       {
//         loading: true,
//       },
//     ]);
//     render(<PostsSection id="user1" />);

//     screen.getByTestId('userPosts');
//     screen.getAllByTestId('userPost');
//   });
// });
