import { QueryResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const getUser: QueryResolvers['getUser'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const user = await userModel.findById(userId);
  return user;
};
