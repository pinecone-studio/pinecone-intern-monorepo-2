// apps/2FH/instagram/backend/src/resolvers/mutations/user/reset-password-mutation.ts
import { User, UserSchemaType } from "src/models";
import { ResetPasswordInput } from "src/generated";
import { encryptHash } from "src/utils";
import { GraphQLError } from "graphql";
import { Document } from "mongoose";
import { otpStorage } from "./forgot-password-mutation";

type UserDocument = Document & UserSchemaType;

const findUserByIdentifier = async (identifier: string): Promise<UserDocument | null> => {
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase().trim() }
    : { userName: identifier.toLowerCase().trim() };
  
  return await User.findOne(query);
};

const validateOTP = (identifier: string, otp: string): boolean => {
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

const resetUserPassword = async (user: UserDocument, newPassword: string): Promise<UserDocument> => {
  const hashedPassword = encryptHash(newPassword);
  
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true }
  );
  
  if (!updatedUser) {
    throw new GraphQLError('Failed to update password', {
      extensions: { code: 'PASSWORD_UPDATE_FAILED' }
    });
  }
  
  return updatedUser;
};

const cleanupOTP = (email: string): void => {
  otpStorage.delete(email.toLowerCase());
};

const validatePasswordStrength = (password: string): void => {
  if (!password || password.length < 6) {
    throw new GraphQLError('Password must be at least 6 characters long', {
      extensions: { code: 'INVALID_PASSWORD' }
    });
  }
};

const getEmailForReset = (identifier: string, user: UserDocument): string => {
  const email = identifier.includes('@') ? identifier : user.email;
  
  if (!email) {
    throw new GraphQLError('Email required for password reset', {
      extensions: { code: 'EMAIL_REQUIRED' }
    });
  }
  
  return email;
};

const handleResetPasswordProcess = async (
  user: UserDocument,
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  validateOTP(email, otp);
  validatePasswordStrength(newPassword);
  await resetUserPassword(user, newPassword);
  cleanupOTP(email);
};

export const resetPassword = async (
  _parent: unknown,
  { input }: { input: ResetPasswordInput }
): Promise<boolean> => {
  try {
    const { identifier, otp, newPassword } = input;
    
    const user = await findUserByIdentifier(identifier);
    
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'USER_NOT_FOUND' }
      });
    }
    
    const email = getEmailForReset(identifier, user);
    
    await handleResetPasswordProcess(user, email, otp, newPassword);
    
    return true;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Password reset failed', {
      extensions: { code: 'PASSWORD_RESET_FAILED' }
    });
  }
};