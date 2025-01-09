// import { QueryResolvers } from 'src/generated';
// import { storyModel } from 'src/models';

// export const getMyActiveStories: QueryResolvers['getMyActiveStories'] = async (_, __, { userId }) => {
//   checkUserIsAuth(userId);

//   const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//   const stories = await storyModel.find({ userId }).populate({
//     path: 'userId',
//     model: 'userModel',
//   });

//   if (!stories || stories.length === 0) {
//     throw new Error('No stories found or they are archived');
//   }

//   const activeStory = stories
//     .map((story) => ({
//       ...(typeof story.toObject === 'function' ? story.toObject() : story),
//       userStories: story.userStories.filter((userStory: { story: { createdAt: Date } }) => new Date(userStory.story.createdAt) >= twentyFourHoursAgo),
//     }))
//     .find((story) => story.userStories.length > 0);

//   if (!activeStory) {
//     throw new Error('No active stories found');
//   }

//   return activeStory;
// };

// const checkUserIsAuth = (userId: string | null) => {
//   if (!userId) throw new Error('Unauthorized');
// };
