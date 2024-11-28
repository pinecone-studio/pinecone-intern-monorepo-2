import { MutationResolvers } from '../../../generated';
import { followModel } from '../../../models/follow.model';
import { userModel } from '../../../models/user.model';

export const sendFollowReq: MutationResolvers['sendFollowReq'] = async (_: unknown, { followerId, followingId, status }) => {
  const findUser = await userModel.findById(followingId);
  if (!findUser) {
    throw new Error('User not found');
  }
  const sendReq = await followModel.create({
    followerId,
    followingId,
    status,
  });
  return sendReq;
};
