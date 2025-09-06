// src/resolvers/mutations/create-user.ts
import { MutationResolvers, UserResponse } from 'src/generated';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';

export const createUser: MutationResolvers['createUser'] = async (_, { input }, { req }) => {
  try {
    console.log('Creating user with input:', JSON.stringify(input));

    // Check if user already exists
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      console.log('User already exists with email:', input.email);
      return UserResponse.Error;
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);
    const newUser = await User.create({
      email: input.email,
      password: hashedPassword,
    });

    console.log('User created successfully:', input.email, 'with ID:', newUser._id);
    const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    await sendUserVerificationLink(origin, input.email);
    return UserResponse.Success;
  } catch (error: unknown) {
    console.error('Failed to create user:', error);
    if (error instanceof GraphQLError) throw error;
    if (error instanceof Error) throw new GraphQLError(error.message);
    throw new GraphQLError('Unknown error');
  }
};
