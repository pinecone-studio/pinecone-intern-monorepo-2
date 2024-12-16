import { SignUpInput } from '../../../generated';
import { sendEmail } from 'src/utils/send-email';
import { otpModel, userModel } from '../../../models';

export const sendOtp = async (_: unknown, { input }: { input: SignUpInput }) => {
  const { email } = input;

  if (!email) throw new Error('Email is required');

  const user = await userModel.findOne({ email });

  if (user) {
    throw new Error('user exists');
  }

  const rndOtp = Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, '0');

  await otpModel.create({ email, otp: rndOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

  await sendEmail(email, rndOtp);

  return { email, message: 'OTP sent successfully' };
};
