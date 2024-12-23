import { QueryResolvers } from '../../../generated';
import User from '../../../models/user.model';

export const getMe: QueryResolvers['getMe'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const user = await User.findById(userId);
  return user;
};
