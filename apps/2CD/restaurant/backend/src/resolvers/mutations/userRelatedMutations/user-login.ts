import { findUserByEmail, verifyPassword, generateToken } from './user-helpers';

type LoginType = {
  email: string;
  password: string;
};

export const userLogin = async (_: unknown, { input }: { input: LoginType }) => {
  try {
    const user = await findUserByEmail(input.email);
    await verifyPassword(input.password, user.password);
    const token = generateToken(user);

    return {
      token,
    };
  } catch (err: any) {
    throw new Error(`Error while user login: ${err.message}`);
  }
};
