import { sendUserVerificationLink } from 'src/utils/mail-handler';

import { User } from 'src/models';
import { createUser } from 'src/resolvers/mutations/create-user';
import { UserResponse, CreateUserInput } from 'src/generated';

import bcryptjs from 'bcryptjs';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  User: { create: jest.fn() },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));

jest.mock('src/utils/mail-handler', () => ({
  sendUserVerificationLink: jest.fn(),
}));

describe('createUser mutation', () => {
  const mockUserInput: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user successfully with req context', async () => {
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    (User.create as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      email: mockUserInput.email,
      password: 'hashedPassword123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const mockReq = {
      nextUrl: {
        protocol: 'http:',
        host: 'localhost:3000',
      },
    };

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser({}, { input: mockUserInput }, { req: mockReq }, {} as any);

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockUserInput.email);

    expect(result).toEqual(UserResponse.Success);
    consoleSpy.mockRestore();
  });

  it('should create user successfully without req context', async () => {
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    (User.create as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      email: mockUserInput.email,
      password: 'hashedPassword123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser({}, { input: mockUserInput }, {}, {} as any);

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(sendUserVerificationLink).not.toHaveBeenCalled();
    expect(result).toEqual(UserResponse.Success);
    consoleSpy.mockRestore();
  });

  it('should create user successfully with req but no nextUrl', async () => {
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    (User.create as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      email: mockUserInput.email,
      password: 'hashedPassword123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const mockReq = {};

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser({}, { input: mockUserInput }, { req: mockReq }, {} as any);

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(sendUserVerificationLink).not.toHaveBeenCalled();
    expect(result).toEqual(UserResponse.Success);
    consoleSpy.mockRestore();
  });

  it('should handle GraphQLError and rethrow it', async () => {
    const graphQLError = new GraphQLError('GraphQL validation error');
    (User.create as jest.Mock).mockRejectedValue(graphQLError);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    if (!createUser) throw new Error('createUser is undefined');
    await expect(createUser({}, { input: mockUserInput }, {}, {} as any))
      .rejects.toThrow('GraphQL validation error');
    consoleSpy.mockRestore();
  });

  it('should handle regular Error and convert to GraphQLError', async () => {
    const regularError = new Error('Database connection failed');
    (User.create as jest.Mock).mockRejectedValue(regularError);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    if (!createUser) throw new Error('createUser is undefined');
    await expect(createUser({}, { input: mockUserInput }, {}, {} as any))
      .rejects.toThrow('Database connection failed');
    consoleSpy.mockRestore();
  });

  it('should handle unknown error type and throw generic GraphQLError', async () => {
    const unknownError = 'String error';
    (User.create as jest.Mock).mockRejectedValue(unknownError);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    if (!createUser) throw new Error('createUser is undefined');
    await expect(createUser({}, { input: mockUserInput }, {}, {} as any))
      .rejects.toThrow('Unknown error');
    consoleSpy.mockRestore();
  });
});
