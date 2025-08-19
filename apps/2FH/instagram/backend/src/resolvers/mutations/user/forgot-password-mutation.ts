import { User } from "src/models";
import { ForgotPasswordInput } from "src/generated";
import { generateOTP, sendOTPEmail } from "src/utils";
import { GraphQLError } from "graphql";

// In-memory OTP storage (in production, use Redis or database)
export const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

const findUserByIdentifier = async (identifier: string) => {
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase().trim() }
    : { userName: identifier.toLowerCase().trim() };
  
  return await User.findOne(query);
};

const storeOTP = (identifier: string, otp: string) => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStorage.set(identifier.toLowerCase(), { otp, expiresAt });
  
  setTimeout(() => {
    otpStorage.delete(identifier.toLowerCase());
  }, 10 * 60 * 1000);
};

const validateAndGetEmail = (user: unknown, identifier: string): string => {
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }

  const userRecord = user as { email?: string };
  const email = identifier.includes('@') ? identifier : userRecord.email;
  
  if (!email) {
    throw new GraphQLError('Email required for password reset', {
      extensions: { code: 'EMAIL_REQUIRED' }
    });
  }

  return email;
};

const processPasswordReset = async (email: string): Promise<void> => {
  const otp = generateOTP();
  storeOTP(email, otp);
  await sendOTPEmail(email, otp);
};

export const forgotPassword = async (
  _parent: unknown,
  { input }: { input: ForgotPasswordInput }
): Promise<boolean> => {
  try {
    const { identifier } = input;
    const user = await findUserByIdentifier(identifier);
    const email = validateAndGetEmail(user, identifier);
    
    await processPasswordReset(email);
    
    return true;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to send reset email', {
      extensions: { code: 'FORGOT_PASSWORD_FAILED' }
    });
  }
};