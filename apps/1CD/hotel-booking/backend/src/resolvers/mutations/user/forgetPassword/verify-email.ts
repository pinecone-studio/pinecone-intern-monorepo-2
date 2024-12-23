import { sendEmail } from 'src/utils/send-email';
import { otpModel, userModel } from '../../../../models';
import { generateOTP } from 'src/utils/generate-otp';
import { MutationResolvers, Response } from 'src/generated';

export const verifyEmail: MutationResolvers['sendOtp'] = async (_, { input }) => {
  const { email } = input;

  if (!email) throw new Error('email is required');

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error('Email does not exist');
  }

  const otp = await generateOTP(email);

  await otpModel.create({ email, otp });

  await sendEmail(email, otp);

  return Response.Success;
};
