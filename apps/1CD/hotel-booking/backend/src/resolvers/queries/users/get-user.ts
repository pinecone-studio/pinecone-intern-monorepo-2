import { QueryResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const getUser: QueryResolvers['getUser'] = async (_, __, { userId }) => {
  console.log('user', userId);
  const user = await userModel.findOne({ _id: userId });
  if (!user) throw new Error('email is not found');
  return user;
};
