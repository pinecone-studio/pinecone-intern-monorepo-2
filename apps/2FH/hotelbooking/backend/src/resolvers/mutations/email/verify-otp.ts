import { OtpModel } from 'src/models/otp-model';

export const verifyOtp = async (_: unknown, { input }: { input: { email: string; otp: string } }) => {
  const { email, otp } = input;
  const otpString = otp.toString();

  const now = new Date();
  const otpRecord = await OtpModel.findOne({
    email,
    otp: otpString,
    expiresAt: { $gt: now },
  }).sort({ expiresAt: -1 });

  if (!otpRecord) throw new Error('Invalid OTP or OTP expired');

  await OtpModel.deleteOne({ _id: otpRecord._id });

  return { message: 'OTP verified' };
};
