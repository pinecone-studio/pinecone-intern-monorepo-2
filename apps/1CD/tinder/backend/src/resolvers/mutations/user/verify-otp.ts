import { GraphQLError } from 'graphql';
import { userModel } from '../../../models';
import { MutationResolvers } from '../../../generated';
import { checkOtpDate } from '../../../utils/user/check-otp-expiration';
import { createToken } from '../../../utils/user/create-token-cookie';

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  if (!input.email || !input.otp) {
    throw new GraphQLError('Email or Otp are required');
  }
  const { otp, email } = input;
  const user = await userModel.findOne({ email, otp });
  if (!user) {
    throw new GraphQLError('USER_NOT_FOUND');
  }
  await checkOtpDate(user);
  const token=await createToken(user);
  return { token };
};
