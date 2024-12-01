import { ForgetPasswordInput } from '../../../generated';
import { userModel } from '../../../models';

import { generateOTP } from '../../../utils/user/generate-otp';
import { sendOtpMail } from '../../../utils/user/send-otp-email';

export const forgetPassword = async (_: unknown, { input }: { input: ForgetPasswordInput }) => {
  const { email } = input;

  const otp = generateOTP();

  const user = await userModel.updateOne(
    {
      email,
    },
    {
      otp,
    }
  );
  if (!user) {
    throw new Error('user not found');
  }

  await sendOtpMail(email, otp);

  return email;
};
