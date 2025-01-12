import { sendEmail } from 'src/library/nodemailer';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { generateOTP } from 'otp-agent';

export const requestChangePassword: MutationResolvers['requestChangePassword'] = async (_, { input }) => {
  const { email } = input;

  const otp = generateOTP();

  await userModel.updateOne(
    {
      email,
    },
    {
      otp,
    }
  );

  await sendEmail(email, `Your OTP is ${otp}`);

  return {
    email,
  };
};
