import { userModel } from '../../../models/user.model';
import crypto from 'crypto';
import { sendResetPassUrlToMail } from '../../../utils/sendmail';
import { MutationResolvers, Response } from 'src/generated';

export const forgetPassword: MutationResolvers['forgetPassword'] = async (_: unknown, { input }) => {
  const { email } = input;
  const userExist = await userModel.findOne({ email });

  if (!userExist) throw new Error('Can not find this email address');

  const resetToken = crypto.randomBytes(25).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  userExist.resetPasswordToken = hashedResetToken;
  userExist.resetPasswordTokenExpire = new Date(Date.now() + 3 * 60 * 1000);

  await userExist.save();
  await sendResetPassUrlToMail(email, resetToken);

  return Response.Success;
};
