import { UserModel } from 'src/models';

type GetUserInput = {
  email: string;
};

export const getUserOne = async (_: unknown, { input }: { input: GetUserInput }) => {
  const { email } = input;

  try {
    const user = await UserModel.findOne({ email }).select('-password');
    if (!user) {
      throw new Error(`User with email ${input.email} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  }
};
