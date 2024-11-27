import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';

export const changePassword: MutationResolvers['changePassword'] = async (_, { input }, { userId }) => {
  const { oldPassword, newPassword } = input;

  const user = await User.findById(userId);

  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new Error('User not found or incorrect password');
  }

  user.password = newPassword;
  const changedUser = await user.save();
  return changedUser;
};
