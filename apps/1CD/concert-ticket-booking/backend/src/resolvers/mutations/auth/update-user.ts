import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';

export const updateUser: MutationResolvers['updateUser'] = async (_, { input }, { userId }) => {
  const { phoneNumber, email } = input;
  const user = await User.findByIdAndUpdate(userId, { phoneNumber, email }, { new: true });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
