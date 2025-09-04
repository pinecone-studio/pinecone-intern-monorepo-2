import { MutationResolvers } from '../../generated';
import { User } from "src/models";
import { OtpToken } from '../../models/otp-token';
import bcrypt from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { PasswordResetResponse } from '../../generated';

const successResponse = (message: string) => ({
  status: PasswordResetResponse.Success,
  message,
});

const errorResponse = (message: string) => ({
  status: PasswordResetResponse.Error,
  message,
});

export const forgotPassword: MutationResolvers['forgotPassword'] = async (_, { input }) => {
  try {
    const { email } = input;  
    const user = await User.findOne({ email });
    if (!user) return errorResponse('Email not registered');

    const otp = await sendUserVerificationLink('https://your-app.com', email);

    await OtpToken.findOneAndDelete({ email });

    await OtpToken.create({
      email,
      otp: otp.toString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    });
    return successResponse('OTP sent to your email');
  } catch (err) {
    console.error(err);
    return errorResponse('Internal server error');
  }
};

function getOtpValidationError(token: Record<string, unknown> | null, otp: string): string | null {
  if (!token) return 'OTP not found';
  if (token.otp !== otp) return 'Incorrect OTP';
  if ((token.expiresAt as Date) < new Date()) return 'OTP expired';
  return null;
}

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  try {
    const { email, otp } = input;
    const token = await OtpToken.findOne({ email });

    const errorMessage = getOtpValidationError(token as unknown as Record<string, unknown>, otp);
    if (errorMessage) return errorResponse(errorMessage);

    return successResponse('OTP verified successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Internal server error');
  }
};

export const resetPassword: MutationResolvers['resetPassword'] = async (_, { input }) => {
  try {
    const { email, newPassword } = input;
    const user = await User.findOne({ email });
    if (!user) return errorResponse('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    await OtpToken.deleteOne({ email });

    return successResponse('Password reset successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Internal server error');
  }
};
