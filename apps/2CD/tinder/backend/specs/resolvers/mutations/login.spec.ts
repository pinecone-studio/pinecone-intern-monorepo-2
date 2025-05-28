import User from 'src/models/user';
import { login } from 'src/resolvers/mutations/user/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login and return a token', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      password: 'hashedpassword',
    };
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve({ ...mockUser, password: 'hashedpassword' }),
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
    (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue('jwt-token');

    const result = await login({}, { email: 'test@example.com', password: 'password' });
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toBe('jwt-token');
  });

  it('should throw if user not found', async () => {
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve(null),
    });
    await expect(login({}, { email: 'notfound@example.com', password: 'password' })).rejects.toThrow('Хэрэглэгч олдсонгүй');
  });

  it('should throw if password is invalid', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      password: 'hashedpassword',
    };
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve(mockUser),
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);
    await expect(login({}, { email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Нууц үг буруу байна');
  });
});
