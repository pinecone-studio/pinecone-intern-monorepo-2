import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from 'src/schemas';
import { resolvers } from 'src/resolvers';
import { User, UserRole } from 'src/models/user';
import dotenv from 'dotenv';

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

const UPDATE_ROLE_MUTATION = `
  mutation UpdateUserRoleToAdmin($userId: ID!) {
    updateUserRoleToAdmin(userId: $userId) {
      _id
      email
      role
    }
  }
`;

interface UpdateUserRoleToAdminResponse {
  data?: {
    updateUserRoleToAdmin: {
      _id: string;
      email: string;
      role: UserRole;
    } | null;
  };
  errors?: { message: string }[];
}

describe('updateUserRoleToAdmin mutation', () => {
  it('updates user role to ADMIN successfully', async () => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password',
      phoneNumber: '1234567890',
      role: UserRole.ADMIN,
    });

    const response = await server.executeOperation({
      query: UPDATE_ROLE_MUTATION,
      variables: { userId: user._id.toString() },
    });

    const typedResponse = response as UpdateUserRoleToAdminResponse;
    const updatedUser = typedResponse.data?.updateUserRoleToAdmin;

    expect(typedResponse.errors).toBeUndefined();
    expect(updatedUser).toBeDefined();
    if (!updatedUser) throw new Error('updatedUser is undefined');

    expect(updatedUser._id).toBe(user._id.toString());
    expect(updatedUser.email).toBe(user.email);
    expect(updatedUser.role).toBe(UserRole.ADMIN);
  });

  it('throws error if user not found', async () => {
    const UserId = new mongoose.Types.ObjectId().toString();

    const response = await server.executeOperation({
      query: UPDATE_ROLE_MUTATION,
      variables: { userId: UserId },
    });
  
    const typedResponse = response as UpdateUserRoleToAdminResponse;
    expect(typedResponse.data?.updateUserRoleToAdmin).toBeUndefined();
    expect(typedResponse.errors?.[0].message).toBe('User not found');
  });
});
