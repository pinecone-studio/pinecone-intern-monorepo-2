import { sendEmail } from 'src/utils/send-email';
import { otpModel, userModel } from '../../../../models';
import { generateOTP } from 'src/utils/generate-otp';
import { MutationResolvers, Response } from 'src/generated';

export const sendOtp: MutationResolvers['sendOtp'] = async (_, { input }) => {
  const { email } = input;

  if (!email) throw new Error('email is required');

  const user = await userModel.findOne({ email });

  if (user) {
    throw new Error('Email already exist');
  }

  const otp = await generateOTP(email);

  await otpModel.create({ email, otp });

  await sendEmail(email, otp);

  return Response.Success;
};
