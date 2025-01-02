import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { GraphQLResolveInfo } from 'graphql';
import { AccountVisibility } from 'src/generated';
import { userModel } from 'src/models';
import { signup } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/user.model.ts');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

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
    const mockHashedPassword = 'hashedPassword123';
    const mockUserId = 'user123';
    const mockToken = 'jwt-token-123';

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('mockHashedPassword');
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
    const mockHashedPassword = 'hashedPassword123';
    const mockUserId = 'user123';
    const mockToken = 'jwt-token-123';
    const inputWithoutVisibility = {
      email: mockInput.email,
      fullName: mockInput.fullName,
      userName: mockInput.userName,
      password: mockInput.password,
    };

    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue('mockHashedPassword');

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
    (bcrypt.hash as jest.Mock).mockResolvedValue('mockHashedPassword');
    (userModel.create as jest.Mock).mockResolvedValue({
      _id: 'userId',
      ...mockInput,
    });

    await expect(signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('JWT_SECRET environment variable is not set');
  });
});
