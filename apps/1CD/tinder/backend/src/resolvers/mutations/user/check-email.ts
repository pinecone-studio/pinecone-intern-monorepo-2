import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { generateOTP } from '../../../utils/user/generate-otp';
import { sendOtpMail } from '../../../utils/user/send-otp-email';
export const checkEmail: MutationResolvers['checkEmail'] = async (_, { input }) => {
  const { email } = input;
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new GraphQLError('Email not found', {
      extensions: { code: 'EMAIL_NOT_FOUND' },
    });
  }

  const otp = generateOTP(email);
  await sendOtpMail(email, otp);
  await userModel
    .findOneAndUpdate({ email }, { otp, otpCreatedAt: new Date()}); 
  return { email };
};
