import mongoose from 'mongoose';
import { ApolloServer, BaseContext } from '@apollo/server';
import { typeDefs } from 'src/schemas';
import { resolvers } from 'src/resolvers';
import { User } from 'src/models/user';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let server: ApolloServer;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start(); 
});
afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
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
      const result = await server.executeOperation({
        query,
        variables,
      });
      let data: Record<string, unknown> | undefined = undefined;
      let errors: Error[] | undefined = undefined;
      if (result.body?.kind === 'single') {
        data = result.body.singleResult.data as Record<string, unknown> | undefined;
        errors = result.body.singleResult.errors as Error[] | undefined;
      } else if (result.body?.kind === 'incremental') {
        data = result.body.initialResult.data as Record<string, unknown> | undefined;
        errors = result.body.initialResult.errors as Error[] | undefined;
      }
      return {
        data,
        errors,
      };
    },
  };
}

describe('createUser mutation (real MongoDB)', () => {
  it('should create a new user', async () => {
    const { executeOperation } = createTestClient(server);

    const result = await executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        input: {
          email: 'test35@example.com',
          password: 'test123',
          phoneNumber: '1234567890',
        },
      },
    });
    const data = result.data as { createUser?: { user?: { email?: string, role?: string } } };
    expect(data?.createUser?.user?.email).toBe('test35@example.com');
    // expect(data?.createUser?.user?.role).toBe('USER');
  });

  it('should fail on duplicate email', async () => {
    await User.create({
      email: 'test31@example.com',
      password: 'dummy',
      phoneNumber: '0000000000'
    });

    const { executeOperation } = createTestClient(server);

    const result = await executeOperation({
      query: CREATE_USER_MUTATION,  
      variables: {
        input: {
          email: 'test31@example.com',
          password: 'newpass',
          phoneNumber: '1111111111'
        },
      },
    });

    expect(result.errors?.[0].message).toContain('User already exist');
  });
});
