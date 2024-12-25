import { userModel } from 'src/models';

export const setPassword = async (_: unknown, { input }: { input: { email: string; password: string } }) => {
  const { email, password } = input;

  const info = { email, password };

  const newUser = await userModel.create({
    ...info,
  });

  await newUser.save();

  return { email: newUser.email, _id: newUser._id, createdAt: newUser.createdAt };
};
