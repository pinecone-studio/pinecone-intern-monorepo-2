import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import { generateOtp } from '../../../utils/generate-otp';
import { generateEmail } from '../../../utils/generate-email';

export const verifyUserEmail: MutationResolvers['verifyUserEmail'] = async (_, { email }) => {
  const user = await User.findOneAndUpdate({ email }, { otp: generateOtp() }, { new: true });

  if (!user) throw new Error('User not found');

  generateEmail(email, user.otp);

  return { message: 'success' };
};
