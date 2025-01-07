// import { storyModel } from 'src/models';
// import { QueryResolvers } from '../../../generated';

// export const getPublicAccStories: QueryResolvers['getPublicAccStories'] = async (_, { userId }) => {
//   try {
//     const stories = await storyModel.find({ userId });
//     if (!stories) {
//       throw new Error(`Story not found`);
//     }
//     return stories;
//   } catch (error) {
//     console.error('err', error);
//     throw new Error('err');
//   }
// };
