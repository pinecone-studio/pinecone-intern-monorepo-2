import { MutationResolvers } from 'src/generated';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { OtpStore } from 'src/models/signup-otp-model';
import { GraphQLError } from 'graphql';
import { User } from 'src/models';

const getOriginFromContext = (context: any): string => {
  if (context.req?.headers?.origin) {
    return context.req.headers.origin;
  }
  if (context.req?.nextUrl) {
    return `${context.req.nextUrl.protocol}//${context.req.nextUrl.host}`;
  }
  return 'http://localhost:3000';
};

const checkUserExists = async (email: string): Promise<void> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new GraphQLError('Email is already registered');
  }
};

const generateAndStoreOtp = async (email: string, origin: string) => {
  const otp = await sendUserVerificationLink(origin, email);
  if (!otp) {
    throw new Error('Failed to generate OTP');
  }

  await OtpStore.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return otp;
};

const handleError = (err: any): never => {
  if (err instanceof GraphQLError) {
    throw err;
  }
  throw new GraphQLError(err.message || 'Something went wrong while sending OTP');
};

export const signupSendOtp: MutationResolvers['signupSendOtp'] = async (_root, { email }, context: any = {}): Promise<{ input: string; output: string }> => {
  try {
    await checkUserExists(email);

    const origin = getOriginFromContext(context);
    const otp = await generateAndStoreOtp(email, origin);

    return { input: email, output: otp.toString() };
  } catch (err: any) {
    handleError(err);
    // This line is never reached because handleError always throws
    /* istanbul ignore next */
    throw err;
  }
};
