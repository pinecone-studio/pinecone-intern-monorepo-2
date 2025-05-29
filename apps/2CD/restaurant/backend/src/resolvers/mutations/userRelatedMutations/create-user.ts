import { User } from 'src/models/user.model';
import bcrypt from 'bcryptjs';

type UserType = {
  userName: string;
  email: string;
  password: string;
};

export const createUser = async (_: unknown, { input }: { input: UserType }) => {
  const { userName, email, password } = input;

  try {
    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      throw new Error('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      wallet: 0,
    });

    return newUser;
  } catch (err: any) {
    throw new Error(`Error creating user: ${err.message}`);
  }
};
