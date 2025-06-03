import { User } from 'src/models/user.model';
import { findUserByEmail } from './user-helpers';
import bcrypt from 'bcryptjs';

type ResetPasswordType = {
  email: string;
  newPassword: string;
};

export const resetPassword = async (_: unknown, { input }: { input: ResetPasswordType }) => {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error('User not found');
  }
  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  return {
    success: true,
    message: 'Password reseted successfuly',
  };
};
