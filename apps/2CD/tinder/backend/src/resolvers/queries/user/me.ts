import User from '../../../models/user';

export const me = async (_parent: unknown, args: { clerkId: string }) => {
  const { clerkId } = args;

  const user = await User.findOne({ clerkId }).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
