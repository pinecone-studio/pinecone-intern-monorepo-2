import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const recoverPassword: MutationResolvers['recoverPassword'] = async (_, { input }) => {
  const { password, resetToken } = input;

  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    {
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpire: { $gt: Date.now() },
    },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) throw new Error('Invalid or expired reset token');

  return { message: 'success' };
};
