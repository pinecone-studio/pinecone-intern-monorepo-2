import { QueryResolvers } from '../../generated';
import { UserModel } from '../../models/user';

export const findUserByEmail: QueryResolvers['findUserByEmail'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });
  return user;
};
