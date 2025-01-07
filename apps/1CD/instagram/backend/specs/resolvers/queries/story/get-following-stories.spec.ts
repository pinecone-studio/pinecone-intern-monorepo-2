/* eslint-disable */
// import { GraphQLResolveInfo } from 'graphql';
// import { getFollowingStories } from '../../../../src/resolvers/queries';
// import { followModel } from '../../../../src/models/follow.model';
// import { storyModel } from '../../../../src/models/story.model';

// jest.mock('../../../../src/models/follow.model', () => ({
//   followModel: {
//     find: jest
//       .fn()
//       .mockResolvedValueOnce([
//         { followerId: '1', status: 'APPROVED', followingId: 'user1' },
//         { followerId: '1', status: 'APPROVED', followingId: 'user2' },
//         { followerId: '1', status: 'PENDING', followingId: 'user3' },
//       ])
//       .mockResolvedValueOnce([]),
//   },
// }));

// jest.mock('../../../../src/models/story.model', () => ({
//   storyModel: {
//     find: jest.fn().mockImplementation(() => ({
//       populate: jest.fn().mockResolvedValueOnce([
//         {
//           _id: 'story1',
//           userId: {
//             _id: 'user1',
//             userName: 'User1',
//           },
//           userStories: [
//             {
//               story: {
//                 _id: 'story1-1',
//                 description: 'Story 1-1',
//                 image: 'image1-1.jpg',
//                 createdAt: new Date(Date.now()),
//               },
//             },
//           ],
//         },
//         {
//           _id: 'story2',
//           userId: {
//             _id: 'user2',
//             userName: 'User2',
//           },
//           userStories: [
//             {
//               story: {
//                 _id: 'story2-1',
//                 description: 'Story 2-1',
//                 image: 'image2-1.jpg',
//                 createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
//               },
//             },
//           ],
//         },
//       ]),
//     })),
//   },
// }));

// describe('getFollowingStories', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return stories from approved followings within the last 24 hours', async () => {
//     const result = await getFollowingStories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

//     expect(followModel.find).toHaveBeenCalledWith({ followerId: '1' });
//     expect(storyModel.find).toHaveBeenCalledWith({
//       userId: { $in: ['user1', 'user2'] },
//       'userStories.story.createdAt': { $gte: expect.any(Date) },
//     });
//     expect(result).toEqual([
//       {
//         _id: 'story1',
//         userId: {
//           _id: 'user1',
//           userName: 'User1',
//         },
//         userStories: [
//           {
//             story: {
//               _id: 'story1-1',
//               description: 'Story 1-1',
//               image: 'image1-1.jpg',
//               createdAt: expect.any(Date),
//             },
//           },
//         ],
//       },
//       {
//         _id: 'story2',
//         userId: {
//           _id: 'user2',
//           userName: 'User2',
//         },
//         userStories: [
//           {
//             story: {
//               _id: 'story2-1',
//               description: 'Story 2-1',
//               image: 'image2-1.jpg',
//               createdAt: expect.any(Date),
//             },
//           },
//         ],
//       },
//     ]);
//   });

//   it('should throw an error if userId is not provided', async () => {
//     await expect(getFollowingStories!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
//   });

//   // it('should return an empty array if no followings are found', async () => {
//   //   (followModel.find as jest.Mock).mockResolvedValueOnce([]); // Simulate no followings

//   //   const result = await getFollowingStories!({}, {}, { userId: '2' }, {} as GraphQLResolveInfo);

//   //   expect(followModel.find).toHaveBeenCalledWith({ followerId: '2' });
//   //   expect(result).toEqual([]); // Expect an empty array
//   // });
// });
