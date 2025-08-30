import { login } from 'src/resolvers/mutations/user/login';
import { UserModel } from 'src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('src/models', () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('login resolver', () => {
  const mockFindOne = UserModel.findOne as jest.Mock;
  const mockCompare = bcrypt.compare as jest.Mock;
  const mockSign = jwt.sign as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return token and user when credentials are valid', async () => {
    const fakeUser = {
      _id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      role: 'user',
      dateOfBirth: '2000-01-01',
    };
    mockFindOne.mockResolvedValue(fakeUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('fakeToken');

    const result = await login(null, { input: { email: 'john@example.com', password: 'Password123!' } });

    expect(result).toEqual({
      token: 'fakeToken',
      user: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        dateOfBirth: '2000-01-01',
      },
    });
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(mockCompare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
    expect(mockSign).toHaveBeenCalledWith({ id: '123' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  });

  it('should throw error if user not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(login(null, { input: { email: 'notfound@example.com', password: 'Password123!' } })).rejects.toThrow('Invalid email or password');
  });

  it('should throw error if password is invalid', async () => {
    const fakeUser = {
      _id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      role: 'user',
      dateOfBirth: '2000-01-01',
    };
    mockFindOne.mockResolvedValue(fakeUser);
    mockCompare.mockResolvedValue(false);

    await expect(login(null, { input: { email: 'john@example.com', password: 'WrongPass!' } })).rejects.toThrow('Invalid email or password');
  });
});
