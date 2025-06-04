import { findUserByEmail, verifyPassword, generateToken } from 'src/resolvers/mutations/user/user-helpers';
import { User } from 'src/models/user.model';
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

describe('it should find user by email if not throw error', () => {
  it('it should throw error if user is not found by email', async () => {
    const mockEmail = 'test@gmail.com';

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(findUserByEmail(mockEmail)).rejects.toThrow("User doesn't exist");
  });

  it('should return if user found', async () => {
    const mockUser = { email: 'test@gmail.com' };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserByEmail('test@gmail.com');
    expect(result).toEqual(mockUser);
  });
});

describe('it should verifyPassword', () => {
  it('it should throw error if password doesnt match', async () => {
    const mockPassword = '123321';
    const storedHash = '12332';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(verifyPassword(mockPassword, storedHash)).rejects.toThrow('Incorrect password');
  });

  it('should return true if the password match', async () => {
    const mockPassword = '123321';
    const storedHash = '123321';

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await verifyPassword(mockPassword, storedHash);

    expect(result).toBe(true);
  });
});

describe('it should generate token', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate the jwt token with user data', () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'testsecret';

    const mockUser = {
      _id: 'user123',
      role: 'user',
      email: 'test@gmail.com',
      userName: 'testuser',
    };
    const fakeToken = 'tokenMoked';

    (jwt.sign as jest.Mock).mockReturnValue(fakeToken);
    const result = generateToken(mockUser);

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
    expect(result).toBe(fakeToken);

    process.env.JWT_SECRET = originalSecret;
  });

  it('should use default secret when JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;

    const mockUser = {
      _id: 'user123',
      role: 'user',
      email: 'test@gmail.com',
      userName: 'testuser',
    };
    const fakeToken = 'tokenMoked';

    (jwt.sign as jest.Mock).mockReturnValue(fakeToken);
    const result = generateToken(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUser._id.toString(),
        role: mockUser.role,
        email: mockUser.email,
        userName: mockUser.userName,
      },
      'your-secret-key',
      { expiresIn: '2 days' }
    );
    expect(result).toBe(fakeToken);
  });
});
