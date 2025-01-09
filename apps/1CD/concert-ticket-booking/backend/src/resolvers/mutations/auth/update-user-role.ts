import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';

export const updateUserRole: MutationResolvers['updateUserRole'] = async (_, { input }) => {
  const { email, role } = input;

  const admin = await User.findOne({ email });
  if (!admin) {
    throw new Error('User not found');
  }

  admin.role = role;
  await admin.save();

  return admin;
};
