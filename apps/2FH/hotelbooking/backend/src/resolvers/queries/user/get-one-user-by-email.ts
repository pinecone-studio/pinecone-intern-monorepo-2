import { UserModel } from 'src/models';

type EmailType = {
  email: string;
};

async function fetchUserByEmail(email?: string) {
  const user = await UserModel.findOne({ email }).select('-password');

  if (!user) {
    throw new Error(`User not found with email ${email}`);
  }

  return user;
}

export const getUserByEmail = async (_: unknown, { input }: { input: EmailType }) => {
  const { email } = input;

  if (!email || email.trim() === '') {
    throw new Error('Please provide a valid email');
  }

  try {
    return await fetchUserByEmail(email.trim());
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  }
};
