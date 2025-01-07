/* eslint-disable */
// import { getMyStories } from '../../../../src/resolvers/queries';
// import { GraphQLResolveInfo } from 'graphql';

// jest.mock('../../../../src/models/story.model.ts', () => ({
//   storyModel: {
//     findOne: jest.fn().mockReturnValue({
//       populate: jest.fn().mockReturnValue([
//         {
//           _id: '12',
//           description: 'Post 1',
//           image: 'img1',
//           createdAt: 'date',
//         },
//         {
//           _id: '12',
//           description: 'Post 1',
//           image: 'img1',
//           createdAt: 'date',
//         },
//       ]),
//     }),
//   },
// }));

// describe('get my stories', () => {
//   it('should throw an error when userId is not provided', async () => {
//     await expect(getMyStories!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
//   });

//   it('should get my stories', async () => {
//     const response = await getMyStories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

//     expect(response).toEqual([
//       {
//         _id: '12',
//         description: 'Post 1',
//         image: 'img1',
//         createdAt: 'date',
//       },
//       {
//         _id: '12',
//         description: 'Post 1',
//         image: 'img1',
//         createdAt: 'date',
//       },
//     ]);
//   });
// });
