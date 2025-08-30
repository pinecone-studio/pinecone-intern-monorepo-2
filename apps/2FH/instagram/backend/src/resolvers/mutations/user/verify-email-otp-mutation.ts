//verify-email-otp-mutation.ts
import { GraphQLError } from "graphql";
import { otpStorage } from "./forgot-password-mutation";
import { User } from "src/models";

const validateEmailFormat = (email: string) => {
  if (!email || !email.includes('@')) {
    throw new GraphQLError('Valid email address is required', {
      extensions: { code: 'INVALID_EMAIL' }
    });
  }
};

const validateOTPFormat = (otp: string) => {
  if (!otp || otp.length !== 6) {
    throw new GraphQLError('Valid 6-digit OTP is required', {
      extensions: { code: 'INVALID_OTP_FORMAT' }
    });
  }
};

const validateEmailOTP = (email: string, otp: string) => {
  const key = `verification_${email.toLowerCase().trim()}`;
  const storedData = otpStorage.get(key);
  
  if (!storedData) {
    throw new GraphQLError('Verification OTP not found or expired', {
      extensions: { code: 'VERIFICATION_OTP_NOT_FOUND' }
    });
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(key);
    throw new GraphQLError('Verification OTP has expired', {
      extensions: { code: 'VERIFICATION_OTP_EXPIRED' }
    });
  }
  
  if (storedData.otp !== otp) {
    throw new GraphQLError('Invalid verification OTP', {
      extensions: { code: 'INVALID_VERIFICATION_OTP' }
    });
  }
  
  otpStorage.delete(key);
  return true;
};

const updateUserVerification = async (email: string) => {
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { isVerified: true },
    { new: true }
  );
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }
  
  return user;
};

const processEmailVerification = async (email: string, otp: string) => {
  validateEmailFormat(email);
  validateOTPFormat(otp);
  validateEmailOTP(email, otp);
  await updateUserVerification(email);
  return true;
};

export const verifyEmailOTP = async (
  _parent: unknown,
  { email, otp }: { email: string; otp: string }
): Promise<boolean> => {
  try {
    return await processEmailVerification(email, otp);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Email OTP verification failed', {
      extensions: { code: 'EMAIL_OTP_VERIFICATION_FAILED' }
    });
  }
};