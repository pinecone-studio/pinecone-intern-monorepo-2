import crypto from 'crypto';
import { OtpModel } from 'src/models/otp-model';
import { sendEmail } from 'src/utils/sent-email';

export const sendOtp = async (_: unknown, { email }: { email: string }) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await OtpModel.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 90 * 1000),
  });

  await sendEmail({
    to: email,
    subject: 'Your signup OTP',
    text: `Your OTP code is ${otp}.`,
  });

  return { message: 'OTP sent' };
};
