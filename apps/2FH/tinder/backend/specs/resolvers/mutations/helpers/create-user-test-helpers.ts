import { createUser } from 'src/resolvers/mutations/create-user';
import { UserResponse } from 'src/generated';
import { GraphQLError } from 'graphql';

// Define proper types instead of using 'any'
export interface CreateUserInput {
  email: string;
  password: string;
}

export interface CreateUserContext {
  req: {
    nextUrl: {
      protocol: string;
      host: string;
    };
  };
}

export interface CreateUserArgs {
  input: CreateUserInput;
}

export type CreateUserFunction = (
  _parent: unknown,
  _args: CreateUserArgs,
  _context: CreateUserContext
) => Promise<UserResponse>;

// Helper function to call createUser with proper typing
export const callCreateUser = async (
  input: CreateUserInput,
  context: CreateUserContext
): Promise<UserResponse> => {
  return (createUser as CreateUserFunction)({}, { input }, context);
};

// Test data factories
export const createMockInput = (overrides: Partial<CreateUserInput> = {}): CreateUserInput => ({
  email: 'test@example.com',
  password: '123456',
  ...overrides,
});

export const createMockContext = (overrides: Partial<CreateUserContext> = {}): CreateUserContext => ({
  req: {
    nextUrl: {
      protocol: 'https:',
      host: 'example.com',
    },
    ...overrides.req,
  },
  ...overrides,
});

// Error creation helpers
export const createGraphQLError = (message: string): GraphQLError => new GraphQLError(message);

export const createRegularError = (message: string): Error => new Error(message);

// Test expectation helpers
export const expectGraphQLError = (error: unknown, expectedMessage: string): void => {
  expect(error).toBeInstanceOf(GraphQLError);
  expect((error as GraphQLError).message).toBe(expectedMessage);
};