import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { generateOTP } from '../../../utils/user/generate-otp';
import { sendOtpMail } from '../../../utils/user/send-otp-email';

export const resendOtp: MutationResolvers['resendOtp'] = async (_, { input }) => {
  const { email } = input;
  const otp = await generateOTP(email);
  await sendOtpMail(email, otp);
  await userModel.findOneAndUpdate({ email }, { otp ,otpCreatedAt:new Date()});
  return { email };
};
