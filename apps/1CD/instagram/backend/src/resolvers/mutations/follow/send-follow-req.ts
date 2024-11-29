import { MutationResolvers } from '../../../generated';
import { followModel } from '../../../models/follow.model';
import { userModel } from '../../../models/user.model';

export const sendFollowReq: MutationResolvers['sendFollowReq'] = async (_: unknown, { followerId, followingId }) => {
  const findUser = await userModel.findById(followingId);
  if (!findUser) {
    throw new Error('User not found');
  }

  let status;
  if (findUser.accountVisibility === 'private') {
    status = 'pending';
  } else {
    status = 'approved';
  }

  const sendRequest = await followModel.create({ followerId, followingId, status });
  return sendRequest;
};
