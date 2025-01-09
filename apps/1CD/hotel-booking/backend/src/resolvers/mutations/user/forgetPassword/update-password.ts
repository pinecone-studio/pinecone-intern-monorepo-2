import { userModel } from 'src/models';
import bcrypt from 'bcrypt';
import { Response } from 'src/generated';

export const updatePassword = async (_: unknown, { input }: { input: { email: string; password: string } }) => {
  const { email, password } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

  if (!updatedUser) {
    throw new Error('User not found');
  }
  await updatedUser.save();

  return Response.Success;
};
