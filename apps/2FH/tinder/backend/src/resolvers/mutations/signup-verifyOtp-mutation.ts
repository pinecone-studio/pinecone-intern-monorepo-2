// src/resolvers/mutations/verify-otp.ts
import { MutationResolvers } from 'src/generated';
import { OtpStore } from 'src/models/signupOtp-model';

export const signUpVerifyOtp: MutationResolvers['signUpVerifyOtp'] = async (_, { email, otp }) => {
  const record = await OtpStore.findOne({ email, otp });
  if (!record || new Date() > new Date(record.expiresAt)) {
    throw new Error('Invalid or expired OTP');
  }

  await OtpStore.deleteOne({ email }); // cleanup
  return { input: email, output: 'OTP verified successfully' };
};
