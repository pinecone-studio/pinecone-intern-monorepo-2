import { followModel } from 'src/models/follow.model';
import { FollowStatus, QueryResolvers } from '../../../generated';
import { storyModel, StoryPopulatedType } from 'src/models';

export const getFollowingStories: QueryResolvers['getFollowingStories'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const followings = await followModel.find({ followerId: userId });

  const approvedFollowings = followings.filter((following) => {
    return following.status === FollowStatus.Approved;
  });

  const stories = await storyModel
    .find({
      userId: approvedFollowings.map((item) => {
        return item.followingId;
      }),
    })
    .populate<StoryPopulatedType>('userId');

  return stories.sort((a, b) => {
    return b.createdAt.valueOf() - a.createdAt.valueOf();
  });
};
