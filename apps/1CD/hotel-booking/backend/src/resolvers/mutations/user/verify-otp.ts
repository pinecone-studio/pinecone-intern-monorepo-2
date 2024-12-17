import { otpModel } from '../../../models';

export const verifyOtp = async (_: unknown, { input }: { input: { otp: string; email: string | undefined } }) => {
  const { otp, email } = input;

  const otpRecord = await otpModel.findOne({ email, otp });

  if (!otpRecord) {
    throw new Error('Invalid OTP');
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    throw new Error('OTP has expired');
  }

  await otpModel.deleteOne({ email, otp });

  return { email, message: 'Email verified successfully' };
};
