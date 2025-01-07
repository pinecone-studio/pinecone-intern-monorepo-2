// import { storyModel } from 'src/models';
// import { QueryResolvers } from '../../../generated';

// export const getMyStories: QueryResolvers['getMyStories'] = async (_, __, { userId }) => {
//   if (!userId) throw new Error('Unauthorized');

//   const myStories = await storyModel.findOne({ userId }).populate({
//     path: 'user',
//     model: 'userModel',
//   });

//   return myStories;
// };
