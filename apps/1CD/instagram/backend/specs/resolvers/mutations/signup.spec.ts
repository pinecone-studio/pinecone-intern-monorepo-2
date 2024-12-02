import { signup } from '../../../src/resolvers/mutations/signup';
import { userModel } from '../../../src/models/user.model';
import jwt from 'jsonwebtoken';
import { AccountVisibility } from '../../../src/generated';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../src/models/user.model');
jest.mock('jsonwebtoken');

describe('signup', () => {
  const mockInput = {
    email: 'test@example.com',
    password: 'password123',
    userName: 'testuser',
    fullName: 'Test User',
    accountVisibility: AccountVisibility.Public,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should create a new user successfully', async () => {
    const mockNewUser = {
      _id: 'mockUserId',
      ...mockInput,
    };
    const mockToken = 'mock-jwt-token';

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (userModel.create as jest.Mock).mockResolvedValue(mockNewUser);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await signup!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      user: mockNewUser,
      token: mockToken,
    });
    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(userModel.create).toHaveBeenCalledWith(mockInput);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockNewUser._id }, 'test-secret');
  });

  it('should throw error if user already exists', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({ email: mockInput.email });

    await expect(signup!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('User already exists');
  });

  it('should throw error if JWT_SECRET is not set', async () => {
    process.env.JWT_SECRET = '';

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (userModel.create as jest.Mock).mockResolvedValue({ _id: 'mockUserId', ...mockInput });

    await expect(signup!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('JWT_SECRET environment variable is not set');
  });

  it('should create user with default PUBLIC visibility when not specified', async () => {
    const inputWithoutVisibility = {
      email: 'test@example.com',
      password: 'password123',
      userName: 'testuser',
      fullName: 'Test User',
    };
    const mockNewUser = {
      _id: 'mockUserId',
      ...inputWithoutVisibility,
      accountVisibility: AccountVisibility.Public,
    };
    const mockToken = 'mock-jwt-token';

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (userModel.create as jest.Mock).mockResolvedValue(mockNewUser);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await signup!({}, { input: inputWithoutVisibility }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      user: mockNewUser,
      token: mockToken,
    });
    expect(userModel.create).toHaveBeenCalledWith({
      ...inputWithoutVisibility,
      accountVisibility: AccountVisibility.Public,
    });
  });
});
