import { GraphQLError } from 'graphql';
import { userModel } from '../../../models';
import { MutationResolvers } from '../../../generated';
import { checkOtpDate } from '../../../utils/user/check-otp-expiration';

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  if (!input.email || !input.otp) {
    throw new GraphQLError('Email and Otp are required');
  }
  const { otp, email } = input;
  const user = await userModel.findOne({ email, otp });
  if (!user) {
    throw new GraphQLError('USER_NOT_FOUND');
  }  
  await checkOtpDate(user);
  return { email: user.email };
};
