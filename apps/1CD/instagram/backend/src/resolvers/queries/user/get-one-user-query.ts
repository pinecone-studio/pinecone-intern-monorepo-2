import { QueryResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const getOneUser: QueryResolvers['getOneUser'] = async (_, { _id }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const user = await userModel.findById(_id);
  return user;
};
