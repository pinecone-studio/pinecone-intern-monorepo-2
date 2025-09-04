import { GraphQLError } from 'graphql';
import { User } from 'src/models';
import { createUser } from 'src/resolvers/mutations';
import { CreateUserInput } from 'src/generated';
import bcryptjs from 'bcryptjs';
import { setupMockAndExpectError } from '../components/test-helper-components';

jest.mock('src/models', () => ({
  User: { create: jest.fn() },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));

describe('createUser mutation errors', () => {
  const mockUserInput: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws GraphQLError when bcryptjs.hash fails with Error', async () => {
    if (!createUser) throw new Error('createUser is undefined');
    
    await setupMockAndExpectError(
      bcryptjs.hash as jest.Mock,
      new Error('Bcrypt error'),
      () => (createUser as any)({}, { input: mockUserInput }, {} as any, {} as any),
      new GraphQLError('Bcrypt error'),
      () => {
        expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(User.create).not.toHaveBeenCalled();
      }
    );
  });

  it('throws GraphQLError when User.create fails with Error', async () => {
    if (!createUser) throw new Error('createUser is undefined');
    
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    
    await setupMockAndExpectError(
      User.create as jest.Mock,
      new Error('Database error'),
      () => (createUser as any)({}, { input: mockUserInput }, {} as any, {} as any),
      new GraphQLError('Database error'),
      () => {
        expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(User.create).toHaveBeenCalledWith({
          email: mockUserInput.email,
          password: 'hashedPassword123',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      }
    );
  });

  it('throws GraphQLError for non-Error type unknown error', async () => {
    if (!createUser) throw new Error('createUser is undefined');
    
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    
    await setupMockAndExpectError(
      User.create as jest.Mock,
      new Error('Unknown error'),
      () => (createUser as any)({}, { input: mockUserInput }, {} as any, {} as any),
      new GraphQLError('Unknown error'),
      () => {
        expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(User.create).toHaveBeenCalledWith({
          email: mockUserInput.email,
          password: 'hashedPassword123',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      }
    );
  });

  it('rethrows GraphQLError when thrown internally', async () => {
    const graphQLError = new GraphQLError('Custom GraphQL error');
    (bcryptjs.hash as jest.Mock).mockRejectedValue(graphQLError);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');
    
    await expect(createUser({}, { input: mockUserInput }, {} as any, {} as any))
      .rejects.toThrow(new GraphQLError('Custom GraphQL error'));

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Creating user with input:', JSON.stringify(mockUserInput));
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Failed to create user:', graphQLError);
    consoleSpy.mockRestore();
  });
});
