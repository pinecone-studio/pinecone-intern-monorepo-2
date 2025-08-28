import { User } from "src/models";
import { GraphQLError } from "graphql";
import { otpStorage } from "./forgot-password-mutation";

type UserRecord ={
  email?: string;
  userName?: string;
}

const findUserByIdentifier = async (identifier: string) => {
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase().trim() }
    : { userName: identifier.toLowerCase().trim() };
  
  return await User.findOne(query);
};

const validateOTP = (identifier: string, otp: string) => {
  const key = identifier.toLowerCase();
  const storedData = otpStorage.get(key);
  
  if (!storedData) {
    throw new GraphQLError('OTP not found or expired', {
      extensions: { code: 'OTP_NOT_FOUND' }
    });
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(key);
    throw new GraphQLError('OTP has expired', {
      extensions: { code: 'OTP_EXPIRED' }
    });
  }
  
  if (storedData.otp !== otp) {
    throw new GraphQLError('Invalid OTP', {
      extensions: { code: 'INVALID_OTP' }
    });
  }
  return true;
};

const getEmailForVerification = (identifier: string, user: UserRecord): string => {
  if (identifier.includes('@')) {
    return identifier;
  }
  
  if (!user.email) {
    throw new GraphQLError('Email required for OTP verification', {
      extensions: { code: 'EMAIL_REQUIRED' }
    });
  }
  
  return user.email;
};

const performOTPVerification = async (identifier: string, otp: string) => {
  const user = await findUserByIdentifier(identifier);
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }

  const email = getEmailForVerification(identifier, user);
  validateOTP(email, otp);
  
  return true;
};

export const verifyOTP = async (
  _parent: unknown,
  { identifier, otp }: { identifier: string; otp: string }
) => {
  try {
    return await performOTPVerification(identifier, otp);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('OTP verification failed', {
      extensions: { code: 'OTP_VERIFICATION_FAILED' }
    });
  }
};