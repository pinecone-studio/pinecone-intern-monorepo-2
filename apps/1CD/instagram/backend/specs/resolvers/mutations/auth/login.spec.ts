import { userModel } from 'src/models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { GraphQLResolveInfo } from 'graphql';
import { login } from 'src/resolvers/mutations/auth/login';

jest.mock('src/models/user.model');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('login mutation', () => {
  const mockInput = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUser = {
    _id: 'user123',
    email: mockInput.email,
    password: bcrypt.hashSync(mockInput.password, 10),
    fullName: 'Test User',
    userName: 'testuser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should return user and token for valid credentials', async () => {
    const mockToken = 'jwt-token-123';

    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await login!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.compareSync).toHaveBeenCalledWith(mockInput.password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.JWT_SECRET!);
    expect(result).toEqual({
      user: mockUser,
      token: mockToken,
    });
  });

  it('should throw an error if the user does not exist', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(login!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error if the password is incorrect', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    await expect(login!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Хэрэглэгчийн нууц үг тохирохгүй байна.');
  });

  it('should throw an error if JWT_SECRET is not set', async () => {
    delete process.env.JWT_SECRET;

    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(login!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('JWT_SECRET environment variable is not set');
  });
});
