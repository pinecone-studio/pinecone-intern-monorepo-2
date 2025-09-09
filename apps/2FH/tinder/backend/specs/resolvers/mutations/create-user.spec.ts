import { User } from 'src/models';
import { createUser } from 'src/resolvers/mutations';
import { UserResponse, CreateUserInput } from 'src/generated';
import { GraphQLError } from 'graphql';

import bcryptjs from 'bcryptjs';

jest.mock('src/models', () => ({
  User: { findOne: jest.fn(), create: jest.fn() },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));

describe('createUser mutation', () => {
  const mockUserInput: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
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
    const result = await createUser!({}, { input: mockUserInput }, {} as any, {} as any);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUserInput.email });
    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(result).toEqual({
      status: UserResponse.Success,
      message: 'User created successfully',
      userId: '507f1f77bcf86cd799439012',
    });
    consoleSpy.mockRestore();
  });

  it('should return error when user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      email: mockUserInput.email,
      password: 'existingPassword',
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser!({}, { input: mockUserInput }, {} as any, {} as any);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUserInput.email });
    expect(bcryptjs.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();

    expect(result).toEqual({
      status: UserResponse.Error,
      message: 'User already exists with this email',
      userId: undefined,
    });
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError when GraphQLError is caught', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcryptjs.hash as jest.Mock).mockRejectedValue(new GraphQLError('GraphQL error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');

    await expect(createUser!({}, { input: mockUserInput }, {} as any, {} as any))
      .rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', expect.any(GraphQLError));
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError when Error is caught', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcryptjs.hash as jest.Mock).mockRejectedValue(new Error('Database error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');

    await expect(createUser!({}, { input: mockUserInput }, {} as any, {} as any))
      .rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError for unknown error', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcryptjs.hash as jest.Mock).mockRejectedValue('unknown error');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');

    await expect(createUser!({}, { input: mockUserInput }, {} as any, {} as any))
      .rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', 'unknown error');
    consoleSpy.mockRestore();
  });
});
