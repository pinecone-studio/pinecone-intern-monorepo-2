
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { checkExistingEmail } from '../../../utils/user/check-existing-email';
import { sendOtpMail } from '../../../utils/user/send-otp-email';
import { generateOTP } from '../../../utils/user/generate-otp';

export const registerEmail: MutationResolvers['registerEmail'] = async (_, { input }) => {
  const { email } = input;
 
    await checkExistingEmail(email);
    const otp = generateOTP();
    await sendOtpMail(email, otp);
    await userModel.create({ ...input, otp });
    return { email };
};
