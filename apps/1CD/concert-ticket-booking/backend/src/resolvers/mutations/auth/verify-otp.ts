import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import crypto from 'crypto';
import { sendEmailWithLink } from '../../../utils/sent-recover-link';

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  const { email, otp } = input;
  const user = await User.findOne({ email, otp });
  if (!user) {
    throw new Error('User not found');
  }
  const resetToken = crypto.randomBytes(25).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetToken = hashedResetToken;
  user.passwordResetTokenExpire = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendEmailWithLink(email, resetToken);
  return { message: 'success' };
};
