import { User } from 'src/models/user.model';
import bcrypt from 'bcryptjs';

type ChangePasswordType = {
  currentPassword: string;
  newPassword: string;
  userID: string;
};

export const changePassword = async (_: unknown, { input }: { input: ChangePasswordType }) => {
  const user = await User.findById(input.userID);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is wrong');
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);

  await User.findByIdAndUpdate(input.userID, {
    password: hashedPassword,
  });

  return {
    success: true,
    message: 'Password changed successfully',
  };
};
