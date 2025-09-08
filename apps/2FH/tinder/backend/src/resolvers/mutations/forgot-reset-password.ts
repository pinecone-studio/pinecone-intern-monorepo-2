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

const validateEmailCredentials = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    return errorResponse('Email service not configured');
  }
  return null;
};

const createOtpToken = async (email: string, otp: number) => {
  await OtpToken.findOneAndDelete({ email });
  await OtpToken.create({
    email,
    otp: otp.toString(),
    expiresAt: new Date(Date.now() + 15 * 1000),
  });
};

const processForgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return errorResponse('Email not registered');

  const otp = await sendUserVerificationLink('https://your-app.com', email);
  await createOtpToken(email, otp);
  
  return successResponse('OTP sent to your email');
};

export const forgotPassword: MutationResolvers['forgotPassword'] = async (_, { input }) => {
  try {
    const { email } = input;  
    console.log('Forgot password request for email:', email);
    
    const credentialError = validateEmailCredentials();
    if (credentialError) return credentialError;
    
    return await processForgotPassword(email);
  } catch (err) {
    console.error('Forgot password error:', err);
    return errorResponse(`Internal server error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

function getOtpValidationError(token: { otp: string; expiresAt: Date } | null, otp: string): string | null {
  if (!token) return 'OTP not found';
  if (token.otp !== otp) return 'Incorrect OTP';
  if (token.expiresAt < new Date()) return 'OTP expired';
  return null;
}

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  try {
    const { email, otp } = input;
    console.log("OTPOTPPPPP",otp)
    const token = await OtpToken.findOne({ email });

    const errorMessage = getOtpValidationError(token, otp);
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
