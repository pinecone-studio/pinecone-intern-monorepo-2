// src/resolvers/mutations/create-user.ts
import { MutationResolvers, UserResponse } from 'src/generated';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';

const createUserRecord = async (email: string, password: string) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  await User.create({
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

const sendVerificationIfPossible = async (req: any, email: string) => {
  if (req?.nextUrl) {
    const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    await sendUserVerificationLink(origin, email);
  } else {
    console.log('Request context not available, skipping verification link');
  }
};

const handleCreateUserError = (error: unknown): never => {
  console.log('Failed to create user:', error);
  if (error instanceof GraphQLError) throw error;
  if (error instanceof Error) throw new GraphQLError(error.message);
  throw new GraphQLError('Unknown error');
};

export const createUser: MutationResolvers['createUser'] = async (_, { input }, { req }) => {
  try {
    console.log('Creating user with input:', JSON.stringify(input));

    await createUserRecord(input.email, input.password);
    console.log('User created successfully:', input.email);

    await sendVerificationIfPossible(req, input.email);

    return UserResponse.Success;
  } catch (error: unknown) {
    return handleCreateUserError(error);
  }
};
