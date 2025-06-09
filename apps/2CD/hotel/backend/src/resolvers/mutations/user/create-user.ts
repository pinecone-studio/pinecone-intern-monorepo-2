import jwt from 'jsonwebtoken';
import { IUser, User, UserRole } from 'src/models/user';
import { ApolloError } from 'apollo-server-errors';

interface CreateUserInput {
  input: {
    email: string;
    password: string;
    phoneNumber: string;
    role?: UserRole;
  };
}

export const createUser = async (
  _: unknown,
  { input }: CreateUserInput
): Promise<{ user: IUser; token: string }> => {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new ApolloError('User already exist');
    }

  const newUser = new User({
    email: input.email,
    password: input.password,
    phoneNumber: input.phoneNumber,
    role: input.role ?? UserRole.USER,
  });

  const savedUser = await newUser.save();

  // Generate JWT token           
  const token = jwt.sign(
    { userId: savedUser._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  );

  return {
    user: savedUser,
    token,
  };
};
