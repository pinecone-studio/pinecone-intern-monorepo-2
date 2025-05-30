import { User } from 'src/models/user.model';
import { userLogin } from 'src/resolvers/mutations/userRelatedMutations/user-login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
jest.mock('src/models/user.model', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
describe('userLogin integration test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should successfully login user with correct credentials', async () => {
    const mockUser = {
      _id: 'user123',
      role: 'user',
      email: 'test@gmail.com',
      userName: 'testuser',
      password: 'hashedPassword123',
    };
    const mockInput = {
      email: 'test@gmail.com',
      password: 'plainPassword123',
    };
    const mockToken = 'jwt-token-123';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await userLogin(undefined, { input: mockInput });

    expect(User.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockInput.password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUser._id.toString(),
        role: mockUser.role,
        email: mockUser.email,
        userName: mockUser.userName,
      },
      'testsecret',
      { expiresIn: '2 days' }
    );

    expect(result).toEqual({ token: mockToken });
  });

  it('should throw error when user is not found', async () => {
    const mockInput = {
      email: 'nonexistent@gmail.com',
      password: 'password123',
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userLogin(undefined, { input: mockInput })).rejects.toThrow("Error while user login: User doesn't exist");

    expect(User.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw error when password is incorrect', async () => {
    const mockUser = {
      _id: 'user123',
      role: 'user',
      email: 'test@gmail.com',
      userName: 'testuser',
      password: 'hashedPassword123',
    };
    const mockInput = {
      email: 'test@gmail.com',
      password: 'wrongPassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userLogin(undefined, { input: mockInput })).rejects.toThrow('Error while user login: Incorrect password');

    expect(User.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockInput.password, mockUser.password);
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    const mockInput = {
      email: 'test@gmail.com',
      password: 'password123',
    };

    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    await expect(userLogin(undefined, { input: mockInput })).rejects.toThrow('Error while user login: Database connection failed');

    expect(User.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
