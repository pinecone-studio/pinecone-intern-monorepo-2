import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { checkOtpDate } from '../../../utils/user/check-otp-expiration';

export const forgetOtp: MutationResolvers['forgetOtp'] = async (_, { input }) => {
  const { email, otp } = input;

  const user = await userModel.findOne({ email, otp });
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' },
    });
  }
  await checkOtpDate(user);

  await user.save();

  return { email: user.email };
};
