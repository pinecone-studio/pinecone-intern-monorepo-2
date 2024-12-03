import { signup } from '../../../src/resolvers/mutations/auth/signup';
import { userModel } from '../../../src/models/user.model';
import { AccountVisibility } from '../../../src/generated';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { GraphQLResolveInfo } from 'graphql';

// Mock the dependencies
jest.mock('../../../src/models/user.model');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('signup mutation', () => {
  const mockInput = {
    email: 'test@example.com',
    fullName: 'Test User',
    userName: 'testuser',
    password: 'testpass123',
    accountVisibility: AccountVisibility.Public,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should create a new user successfully with explicit visibility', async () => {
    // Mock return values
    const mockHashedPassword = 'hashedPassword123';
    const mockUserId = 'user123';
    const mockToken = 'jwt-token-123';

    // Setup mocks
    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('mockPassword'),
    });
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHashedPassword),
    });
    (userModel.create as jest.Mock).mockResolvedValue({
      _id: mockUserId,
      ...mockInput,
      password: mockHashedPassword,
    });
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      user: {
        _id: mockUserId,
        ...mockInput,
        password: mockHashedPassword,
      },
      token: mockToken,
    });
  });

  it('should create a new user successfully with default visibility', async () => {
    // Mock return values
    const mockHashedPassword = 'hashedPassword123';
    const mockUserId = 'user123';
    const mockToken = 'jwt-token-123';
    const inputWithoutVisibility = {
      email: mockInput.email,
      fullName: mockInput.fullName,
      userName: mockInput.userName,
      password: mockInput.password,
    };

    // Setup mocks
    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('mockPassword'),
    });
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHashedPassword),
    });
    (userModel.create as jest.Mock).mockResolvedValue({
      _id: mockUserId,
      ...inputWithoutVisibility,
      accountVisibility: AccountVisibility.Public,
      password: mockHashedPassword,
    });
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await signup!({}, { input: inputWithoutVisibility }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      user: {
        _id: mockUserId,
        ...inputWithoutVisibility,
        accountVisibility: AccountVisibility.Public,
        password: mockHashedPassword,
      },
      token: mockToken,
    });
  });

  it('should throw error if user already exists', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({ _id: 'existingUser' });
    await expect(signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('User already exists');
  });

  it('should throw error if JWT_SECRET is not set', async () => {
    delete process.env.JWT_SECRET;
    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('mockPassword'),
    });
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('hashedPassword'),
    });
    (userModel.create as jest.Mock).mockResolvedValue({
      _id: 'userId',
      ...mockInput,
    });

    await expect(signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('JWT_SECRET environment variable is not set');
  });
});
