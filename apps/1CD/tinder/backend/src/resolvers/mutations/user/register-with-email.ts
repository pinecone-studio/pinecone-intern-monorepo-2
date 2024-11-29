import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { checkExistingEmail } from '../../../utils/user/check-existing-email';
import { sendOtpMail } from '../../../utils/user/send-otp-email';
import { generateOTP } from '../../../utils/user/generate-otp';

export const registerEmail: MutationResolvers['registerEmail'] = async (_, { input }) => {
  const { email } = input;
  await checkExistingEmail(email);
  try {
    const otp = generateOTP();
    await userModel.create({ ...input, otp });
    await sendOtpMail(email, otp);
    return { email };
  } catch (error) {
    throw new GraphQLError('Failed to create user', {
      extensions: { code: 'USER_CREATION_FAILED' },
    });
  }
};
