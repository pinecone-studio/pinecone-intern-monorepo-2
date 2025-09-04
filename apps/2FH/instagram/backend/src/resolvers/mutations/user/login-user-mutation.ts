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
  
    return await User.findOne(query)
    .populate('followers', '_id userName fullName profileImage')
    .populate('followings', '_id userName fullName profileImage')
    .populate('posts')
    .populate('stories');
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

const validateUserVerification = (user: any) => {
  if (user.email && !user.isVerified) {
    throw new GraphQLError('Please verify your email address before logging in', {
      extensions: { 
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      }
    });
  }
};

const createLoginResponse = (user: any) => {
  const token = generateToken(user._id.toString(), user.userName);
  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;
  // // DEBUG: Check the final user object
  // console.log('Final user object:', JSON.stringify(userWithoutPassword, null, 2));
  // console.log('Final userName:', userWithoutPassword.userName);
  
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
// // DEBUG: Log the user object to check for null fields
// console.log('User found:', JSON.stringify(user, null, 2));
// console.log('userName specifically:', user.userName);
// console.log('userName type:', typeof user.userName);

// // Check for null/undefined userName before proceeding
// if (!user.userName) {
//   console.error('User has null/undefined userName:', user._id);
//   throw new GraphQLError('User account data is corrupted', {
//     extensions: { code: 'CORRUPTED_USER_DATA' }
//   });
// }  
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
