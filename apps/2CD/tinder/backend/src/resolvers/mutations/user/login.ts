import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateInputs = (email: string, password: string) => {
  if (!email || !password) {
    throw new UserInputError('Email and password are required');
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new UserInputError('Invalid email format');
  }
};

const validateJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwtSecret;
};

const generateToken = (userId: string) => {
  const jwtSecret = validateJwtSecret();
  return jwt.sign({ _id: userId }, jwtSecret);
};

export const login = async (_: unknown, { email, password }: { email: string; password: string }) => {
  validateInputs(email, password);

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UserInputError('Хэрэглэгч олдсонгүй');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UserInputError('Нууц үг буруу байна');
  }

  return generateToken(user._id);
}; 