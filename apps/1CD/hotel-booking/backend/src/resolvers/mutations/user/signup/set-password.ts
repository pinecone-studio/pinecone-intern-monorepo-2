import { userModel } from 'src/models';
import bcrypt from 'bcrypt';
import { Response } from 'src/generated';

export const setPassword = async (_: unknown, { input }: { input: { email: string; password: string } }) => {
  const { email, password } = input;
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(email, password, '3');
  const newUser = await userModel.create({
    email,
    password: hashedPassword,
  });

  if (!newUser) {
    throw new Error('Database error');
  }

  await newUser.save();

  return Response.Success;
};
