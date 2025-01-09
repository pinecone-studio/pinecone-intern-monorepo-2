// import { followModel } from 'src/models/follow.model';
// import { FollowStatus, QueryResolvers } from '../../../generated';
// import { storyModel } from 'src/models';

// export const getFollowingStories: QueryResolvers['getFollowingStories'] = async (_, __, { userId }) => {
//   if (!userId) throw new Error('Unauthorized');

//   const followings = await followModel.find({ followerId: userId });

//   const approvedFollowings = followings.filter((following) => following.status === FollowStatus.Approved);

//   const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//   const stories = await storyModel
//     .find({
//       userId: { $in: approvedFollowings.map((item) => item.followingId) },
//       'userStories.story.createdAt': { $gte: twentyFourHoursAgo },
//     })
//     .populate({
//       path: 'userId',
//       model: 'userModel',
//     });

//   const filteredStories = stories.map((story) => ({
//     _id: story._id,
//     userId: story.userId,
//     userStories: story.userStories.filter((userStory: { story: { createdAt: Date } }) => userStory.story.createdAt >= twentyFourHoursAgo),
//   }));

//   const sortedStories = filteredStories.sort((a, b) => {
//     const latestA = Math.max(...a.userStories.map((s: { story: { createdAt: Date } }) => s.story.createdAt.valueOf()));
//     const latestB = Math.max(...b.userStories.map((s: { story: { createdAt: Date } }) => s.story.createdAt.valueOf()));
//     return latestB - latestA;
//   });

//   return sortedStories;
// };
