import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (_: unknown, { email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UserInputError('Хэрэглэгч олдсонгүй');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UserInputError('Нууц үг буруу байна');
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  return token;
}; 