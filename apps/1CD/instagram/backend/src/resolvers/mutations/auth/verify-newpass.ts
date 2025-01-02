import { MutationResolvers, Response } from '../../../generated';
import { userModel } from '../../../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const verifyNewPass: MutationResolvers['verifyNewPass'] = async (_: unknown, { input }) => {
  const { password, resetToken } = input;
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const userExist = await userModel.findOne({ resetPasswordToken: hashedResetToken, resetPasswordTokenExpire: { $gt: Date.now() } });
  if (!userExist) {
    throw new Error('Your password recovery period has expired.');
  }
  const hashedPass = await bcrypt.hash(password, 10);
  userExist.password = hashedPass;
  await userExist.save();

  return Response.Success;
};
