import { GraphQLError } from 'graphql';
import { generateOTP } from '../../../utils/user/generate-otp';
import { userModel } from '../../../models';
import { MutationResolvers } from '../../../generated';
import { sendOtpMail } from '../../../utils/user/send-otp-email';

export const sendResetOtp: MutationResolvers['sendResetOtp'] = async (_, { input }) => {
  const { email } = input;
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new GraphQLError('Email not found', {
      extensions: { code: 'EMAIL_NOT_FOUND' },
    });
  }

  const otp = generateOTP();
  user.otp = otp;
  await user.save();

  await sendOtpMail(email, otp);

  return { message: 'OTP sent to your email' };
};
