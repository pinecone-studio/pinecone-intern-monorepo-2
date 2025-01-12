/* eslint-disable no-secrets/no-secrets */
import { MutationResolvers, Response } from 'src/generated';
import { followModel, notificationModel } from 'src/models';

export const removeFollowReqFromNotifyByPrivateFollowingIdUser: MutationResolvers['removeFollowReqFromNotifyByPrivateFollowingIdUser'] = async (
  _: unknown,
  { followerId, followingId },
  { userId }
) => {
  if (!userId) throw new Error('Authorization');
  const notifiedFollowReqInfo = await followModel.findOne({ followerId, followingId });
  if (!notifiedFollowReqInfo) throw new Error('follow info not found');
  if (String(notifiedFollowReqInfo.followingId) !== String(userId)) throw new Error('You are not authorized to remove this follower');
  await followModel.findByIdAndDelete(notifiedFollowReqInfo._id);
  await notificationModel.findOneAndDelete({ otherUserId: followerId, currentUserId: followingId });
  return Response.Success;
};
