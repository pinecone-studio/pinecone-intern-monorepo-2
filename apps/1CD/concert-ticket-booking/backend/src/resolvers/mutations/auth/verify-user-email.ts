import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import { generateOtp } from '../../../utils/generate-otp';
import { generateEmail } from '../../../utils/generate-email';

export const verifyUserEmail: MutationResolvers['verifyUserEmail'] = async (_, { email }) => {
  try {
    const user = await User.findOneAndUpdate({ email }, { otp: generateOtp() }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    await generateEmail(email, user.otp);
    return { message: 'success' };
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to verify user email');
  }
};
