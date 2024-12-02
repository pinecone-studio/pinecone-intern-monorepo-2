import { MutationResolvers } from '../../generated';
import { userModel } from '../../models/user.model';
import crypto from 'crypto';

export const verifyNewPass: MutationResolvers['verifyNewPass'] = async (_: unknown, { input }) => {
  const { password, resetToken } = input;
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const userExist = await userModel.findOne({ resetPasswordToken: hashedResetToken, resetPasswordTokenExpire: { $gt: Date.now() } });
  if (!userExist) {
    throw new Error('Your password recovery period has expired.');
  }
  userExist.password = password;
  await userExist.save();

  return userExist;
};
