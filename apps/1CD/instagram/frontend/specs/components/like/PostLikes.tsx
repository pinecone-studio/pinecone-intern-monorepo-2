// import React from 'react';
// import { fireEvent, render, screen } from '@testing-library/react';
// import { useGetPostLikesQuery } from '@/generated';
// import { PostLikes } from '@/components/like/PostLikes';
// import { useAuth } from '@/components/providers';

// jest.mock('@/generated', () => ({
//   useGetPostLikesQuery: jest.fn(),
// }));
// jest.mock('@/components/providers', () => ({
//   useAuth: jest.fn(),
// }));

// describe('CommentCount Component', () => {
//   const mockAuthData = {
//     user: { _id: '1', userName: 'Test User' },
//   };
//   it('renders no comments message when there are no comments', () => {
//     (useGetPostLikesQuery as jest.Mock).mockReturnValue({
//       data: { getPostLikes: [] },
//     });
//     (useAuth as jest.Mock).mockReturnValue(mockAuthData);

//     render(<PostLikes id="123" />);
//     const moreBtn = screen.getByTestId('likeNumber');
//     fireEvent.keyDown(moreBtn, { key: 'Enter' });
//   });

//   it('renders "View comment" when there is one comment', () => {
//     (useGetPostLikesQuery as jest.Mock).mockReturnValue({
//       data: {
//         getPostLikes: [
//           {
//             _id: 'like1',
//             createdAt: 'Date',
//             isLike: true,
//             user: {
//               _id: 'user1',
//               userName: 'B190_$',
//               fullName: 'Bilgun',
//             },
//           },
//         ],
//       },
//     });
//     (useAuth as jest.Mock).mockReturnValue(mockAuthData);
//     render(<PostLikes id="123" />);
//     const moreBtn = screen.getByTestId('likeNumber');
//     fireEvent.keyDown(moreBtn, { key: 'Enter' });
//   });

//   it('renders "View all X comments" when there are multiple comments', () => {
//     (useGetPostLikesQuery as jest.Mock).mockReturnValue({
//       data: {
//         getPostLikes: [
//           {
//             _id: 'like1',
//             createdAt: 'Date',
//             isLike: true,
//             user: {
//               _id: 'user1',
//               userName: 'B190_$',
//               fullName: 'Bilgun',
//             },
//           },
//           {
//             _id: 'like2',
//             createdAt: 'Date',
//             isLike: true,
//             user: {
//               _id: 'user2',
//               userName: 'B190_$',
//               fullName: 'Bilgun',
//             },
//           },
//           {
//             _id: 'like3',
//             createdAt: 'Date',
//             isLike: true,
//             user: {
//               _id: 'user3',
//               userName: 'B190_$',
//               fullName: 'Bilgun',
//             },
//           },
//         ],
//       },
//     });
//     (useAuth as jest.Mock).mockReturnValue(mockAuthData);
//     render(<PostLikes id="123" />);
//     const moreBtn = screen.getByTestId('likeNumber');
//     fireEvent.keyDown(moreBtn, { key: 'Enter' });
//   });
// });
