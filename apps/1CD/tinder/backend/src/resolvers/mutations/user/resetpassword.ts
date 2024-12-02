import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';

export const resetPassword: MutationResolvers['resetPassword'] = async (_, { input }) => {
  const { email, otp, newPassword } = input;

  const user = await userModel.findOne({ email, otp });

  if (!user) {
    throw new GraphQLError('Invalid email or OTP', {
      extensions: { code: 'INVALID_OTP_OR_EMAIL' },
    });
  }

  // user.password = hashPassword(newPassword);

  user.otp = undefined;

  await user.save();

  return { message: 'Password has been reset successfully' };
};
