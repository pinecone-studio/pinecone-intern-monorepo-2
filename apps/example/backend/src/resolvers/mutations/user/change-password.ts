import { MutationResolvers, Response } from '../../../generated';
import { userModel } from '../../../models';

export const changePassword: MutationResolvers['changePassword'] = async (_, { input }) => {
  const { email, password, otp } = input;

  const user = await userModel.findOne({
    email,
  });

  if (!user) throw new Error('User not found');

  if (user.otp !== otp) throw new Error('Invalid OTP');

  await userModel.updateOne(
    {
      email,
    },
    {
      password,
      otp: '',
    }
  );

  return Response.Success;
};
