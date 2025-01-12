import { QueryResolvers } from '../../../generated';
import { userModel } from '../../../models';

export const getMe: QueryResolvers['getMe'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const user = await userModel.findById(userId);

  return user;
};
