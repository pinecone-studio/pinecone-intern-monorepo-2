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

  const otp = generateOTP();
  user.otp = otp;
  await user.save();

  await sendOtpMail(email, otp);

  return { email };
};
