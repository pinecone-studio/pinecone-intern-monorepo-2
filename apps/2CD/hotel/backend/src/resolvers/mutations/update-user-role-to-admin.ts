import { User, UserRole } from 'src/models/user';

export const updateUserRoleToAdmin = async (
  _: unknown,
  { userId }: { userId: string }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = UserRole.ADMIN;
  await user.save();

  return user;
};
