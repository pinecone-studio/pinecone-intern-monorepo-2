import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateInputs = (email: string, password: string) => {
  if (!email || !password) {
    throw new GraphQLError('Email and password are required', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new GraphQLError('Invalid email format', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
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
    throw new GraphQLError('Хэрэглэгч олдсонгүй', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new GraphQLError('Нууц үг буруу байна', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  return generateToken(user._id);
}; 