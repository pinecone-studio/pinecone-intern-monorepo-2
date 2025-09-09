// src/resolvers/mutations/create-user.ts
import { MutationResolvers, UserResponse } from 'src/generated';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import bcryptjs from 'bcryptjs';

export const createUser: MutationResolvers['createUser'] = async (_root, { input }) => {
  try {
    console.log('Creating user with input:', JSON.stringify(input));

    // Check if user already exists
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      console.log('User already exists with email:', input.email);
      return {
        status: UserResponse.Error,
        message: 'User already exists with this email',
        userId: undefined,
      };
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);
    const newUser = await User.create({
      email: input.email,
      password: hashedPassword,
    });

    console.log('User created successfully:', input.email);

    return {
      status: UserResponse.Success,
      message: 'User created successfully',
      userId: newUser._id.toString(),
    };
  } catch (error: unknown) {
    console.error('Failed to create user:', error);
    if (error instanceof GraphQLError) throw error;
    if (error instanceof Error) throw new GraphQLError(error.message);
    throw new GraphQLError('Unknown error');
  }
};
