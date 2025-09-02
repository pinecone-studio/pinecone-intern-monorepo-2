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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '14d' });

  const defaults = {
    firstName: '',
    lastName: '',
    role: 'USER',
    dateOfBirth: '',
  };

  return {
    token,
    user: {
      ...user,
      _id: user._id,
      email: user.email,
      ...defaults,
    },
  };
};
