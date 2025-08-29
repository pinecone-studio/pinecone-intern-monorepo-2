import { UserModel } from 'src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type LoginInput = {
  email: string;
  password: string;
};

export const login = async (_: unknown, { input }: { input: LoginInput }) => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email });
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return {
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
    },
  };
};
