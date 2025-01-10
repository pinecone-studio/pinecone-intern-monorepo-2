import { QueryResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const getUser: QueryResolvers['getUser'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('email is not found');
  const user = await userModel.findById({ _id: userId });
  return user;
};
