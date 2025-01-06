import { userModel } from 'src/models';

export const getUser = async (_: unknown, { email }: { email: string }) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error('email is not found');
  return user;
};
