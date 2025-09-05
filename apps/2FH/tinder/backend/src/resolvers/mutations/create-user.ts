// src/resolvers/mutations/create-user.ts
import { MutationResolvers, UserResponse } from 'src/generated';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import bcryptjs from 'bcryptjs';

export const createUser: MutationResolvers['createUser'] = async (_root, { input }) => {
  try {
    console.log('Creating user with input:', JSON.stringify(input));

    const hashedPassword = await bcryptjs.hash(input.password, 10);
    await User.create({
      email: input.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('User created successfully:', input.email);

    return UserResponse.Success;
  } catch (error: unknown) {
    console.log('Failed to create user:', error);
    if (error instanceof GraphQLError) throw error;
    if (error instanceof Error) throw new GraphQLError(error.message);
    throw new GraphQLError('Unknown error');
  }
};
