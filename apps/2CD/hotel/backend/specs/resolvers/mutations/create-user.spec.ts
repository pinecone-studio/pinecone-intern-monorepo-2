import mongoose from 'mongoose';
import { ApolloServer, BaseContext } from '@apollo/server';
import { typeDefs } from 'src/schemas';
import { resolvers } from 'src/resolvers';
import { User } from 'src/models/user';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { UserRole } from 'src/models/user';

dotenv.config({ path: '.env.test' });

let server: ApolloServer;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        _id
        email
        phoneNumber
        role
      }
      token
    }
  }
`;

type ExecuteOperation = (_options: {
  query: string;
  variables?: Record<string, unknown>;
}) => Promise<{
  data?: Record<string, unknown>;
  errors?: Error[] | undefined;
}>;

function createTestClient(server: ApolloServer<BaseContext>): { executeOperation: ExecuteOperation } {
  return {
    executeOperation: async ({ query, variables }) => {
      const result = await server.executeOperation({ query, variables });
      let data: Record<string, unknown> | undefined = undefined;
      let errors: Error[] | undefined = undefined;

      if (result.body?.kind === 'single') {
        data = result.body.singleResult.data as Record<string, unknown> | undefined;
        errors = result.body.singleResult.errors as Error[] | undefined;
      } else if (result.body?.kind === 'incremental') {
        data = result.body.initialResult.data as Record<string, unknown> | undefined;
        errors = result.body.initialResult.errors as Error[] | undefined;
      }

      return { data, errors };
    },
  };
}

describe('createUser mutation (real MongoDB)', () => {
  it('should create a new user and return a valid token', async () => {
    const { executeOperation } = createTestClient(server);

    const result = await executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        input: {
          email: 'test1-create@example.com',
          password: 'test123',
          phoneNumber: '1234567890',
          role: UserRole.ADMIN,
        },
      },
    });

    const data = result.data as {
      createUser?: { user?: { email?: string; role?: string }; token?: string };
    };

    expect(data?.createUser?.user?.email).toBe('test1-create@example.com');
    expect(data?.createUser?.user?.role).toBe('ADMIN');
    expect(data?.createUser?.token).toBeDefined();
    expect(typeof data?.createUser?.token).toBe('string');

    const token = data?.createUser?.token;
    expect(token).toBeDefined();
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'test-secret') as { userId: string };
    expect(decoded).toHaveProperty('userId');
  });

it('throws error if user with email already exists', async () => {
  await server.executeOperation({
    query: CREATE_USER_MUTATION,
    variables: {
      input: {
        email: 'duplicate@example.com',
        password: 'password123',
        phoneNumber: '99119911',
      },
    },
  });

  const { executeOperation } = createTestClient(server);
  const response = await executeOperation({
    query: CREATE_USER_MUTATION,
    variables: {
      input: {
        email: 'duplicate@example.com',
        password: 'password123',
        phoneNumber: '99119911',
      },
    },
  });

  expect(response.errors?.[0].message).toBe('User already exist');
});


it('should create token using fallback secret if JWT_SECRET is undefined', async () => {
  const originalSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  const { executeOperation } = createTestClient(server);

  const result = await executeOperation({
    query: CREATE_USER_MUTATION,
    variables: {
      input: {
        email: 'fallback-secret@example.com',
        password: 'password',
        phoneNumber: '2222222222',
      },
    },
  });

  const data = result.data as { createUser?: { token?: string } };
  const token = data?.createUser?.token;
  expect(token).toBeDefined();

  expect(typeof token).toBe('string');
  const decoded = jwt.verify(token as string, 'test-secret') as unknown as { userId: string };
  expect(decoded).toHaveProperty('userId');

  process.env.JWT_SECRET = originalSecret; 
});
});
