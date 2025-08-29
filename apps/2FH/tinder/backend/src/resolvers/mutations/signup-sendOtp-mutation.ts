import { MutationResolvers } from 'src/generated';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { OtpStore } from 'src/models/signupOtp-model';
import { GraphQLError } from 'graphql';
import { User } from 'src/models';
export const signupSendOtp: MutationResolvers['signupSendOtp'] = async (_, { email }, context: any = {}) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new GraphQLError('Email is already registered');
    }

    let origin;
    if (context.req?.headers?.origin) {
      origin = context.req.headers.origin;
    } else if (context.req?.nextUrl) {
      origin = `${context.req.nextUrl.protocol}//${context.req.nextUrl.host}`;
    } else {
      origin = 'http://localhost:3000';
    }

    const otp = await sendUserVerificationLink(origin, email);
    if (!otp) {
      throw new Error('Failed to generate OTP');
    }

    await OtpStore.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return { input: email, output: otp.toString() };
  } catch (err: any) {
    if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(err.message || 'Something went wrong while sending OTP');
  }
};
