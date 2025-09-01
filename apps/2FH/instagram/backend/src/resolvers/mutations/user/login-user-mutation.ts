//login-user-mutation.ts
import { User } from "src/models";
import { LoginInput } from "src/generated";
import { decryptHash } from "src/utils";
import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken';
import { getJwtSecret } from 'src/utils/check-jwt';

const JWT_SECRET = getJwtSecret();

const findUserByIdentifier = async (identifier: string) => {
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase().trim() }
    : { userName: identifier.toLowerCase().trim() };
  
  return await User.findOne(query);
};

const validatePassword = (password: string, hashedPassword: string) => {
  const isValid = decryptHash(password, hashedPassword);
  
  if (!isValid) {
    throw new GraphQLError('Invalid credentials', {
      extensions: { code: 'INVALID_CREDENTIALS' }
    });
  }
};

const generateToken = (userId: string, userName: string) => {
  return jwt.sign(
    { 
      userId, 
      userName 
    },
    JWT_SECRET,
    { 
      expiresIn: '100d',
      algorithm: 'HS256'
    }
  );
};

const validateUserVerification = (user: { email?: string; isVerified?: boolean }) => {
  if (user.email && !user.isVerified) {
    throw new GraphQLError('Please verify your email address before logging in', {
      extensions: { 
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      }
    });
  }
};

const createLoginResponse = (user: { _id: { toString(): string }; userName: string; toObject(): { password: string; [key: string]: unknown } }) => {
  const token = generateToken(user._id.toString(), user.userName);
  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;
  
  return {
    user: userWithoutPassword,
    token
  };
};

const processLogin = async (input: LoginInput) => {
  const { identifier, password } = input;
  const user = await findUserByIdentifier(identifier);
  
  if (!user) {
    throw new GraphQLError('Invalid credentials', {
      extensions: { code: 'INVALID_CREDENTIALS' }
    });
  }
  
  validatePassword(password, user.password);
  validateUserVerification(user);
  
  return createLoginResponse(user);
};

export const loginUser = async (
  _parent: unknown,
  { input }: { input: LoginInput }
) => {
  try {
    return await processLogin(input);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Login failed', {
      extensions: { code: 'LOGIN_FAILED' }
    });
  }
};
