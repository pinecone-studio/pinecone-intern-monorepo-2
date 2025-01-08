import { notificationModel } from 'src/models';
import { AccountVisibility, FollowStatus, MutationResolvers, NotificationType } from '../../../generated';
import { followModel } from '../../../models/follow.model';
import { userModel } from '../../../models/user.model';

export const sendFollowReq: MutationResolvers['sendFollowReq'] = async (_: unknown, { followerId, followingId }, { userId }) => {
  if (followerId !== userId) {
    throw new Error('Unauthorized');
  }

  const user = await userModel.findById(followingId);

  if (!user) {
    throw new Error('User not found');
  }

  const { accountVisibility } = user;

  const status = accountVisibility === AccountVisibility.Private ? FollowStatus.Pending : FollowStatus.Approved;

  const sendRequest = await followModel.create({ followerId, followingId, status });
  await notificationModel.create({ otherUserId: followerId, currentUserId: followingId, notificationType: NotificationType.Follow });
  return sendRequest;
};
