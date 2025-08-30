//send-verification-email-mutation.ts
import { SendVerificationEmailInput } from "src/generated";
import { generateOTP, sendVerificationEmail as sendEmail } from "src/utils";
import { GraphQLError } from "graphql";
import { otpStorage } from "./forgot-password-mutation";

const storeVerificationOTP = (email: string, otp: string) => {
  const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const key = `verification_${email.toLowerCase().trim()}`;
  const expiresAt = Date.now() + OTP_TTL_MS;
  otpStorage.set(key, { otp, expiresAt });
  
  setTimeout(() => {
    const current = otpStorage.get(key);
    if (current && current.expiresAt === expiresAt) {
      otpStorage.delete(key);
    }
  }, OTP_TTL_MS);
};

const validateEmail = (email: string) => {
  if (!email || !email.includes('@')) {
    throw new GraphQLError('Valid email address is required', {
      extensions: { code: 'INVALID_EMAIL' }
    });
  }
};

const processVerificationEmail = async (email: string): Promise<void> => {
  const otp = generateOTP();
  storeVerificationOTP(email, otp);
  await sendEmail(email, otp); 
};

export const sendVerificationEmail = async ( 
  _parent: unknown,
  { input }: { input: SendVerificationEmailInput }
): Promise<boolean> => {
  try {
    const { email } = input;
    validateEmail(email);
    await processVerificationEmail(email);
    return true;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to send verification email', {
      extensions: { code: 'VERIFICATION_EMAIL_FAILED' }
    });
  }
};
