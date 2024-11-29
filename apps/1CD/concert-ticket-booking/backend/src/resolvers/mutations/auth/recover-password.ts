import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import crypto from 'crypto';

export const recoverPassword: MutationResolvers['recoverPassword'] = async (_, { input }) => {
  const { password, resetToken } = input;

  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOneAndUpdate(
    {
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpire: { $gt: Date.now() },
    },
    { password },
    { new: true }
  );
  if (!user) throw new Error('Invalid or expired reset token');

  return user;
};
