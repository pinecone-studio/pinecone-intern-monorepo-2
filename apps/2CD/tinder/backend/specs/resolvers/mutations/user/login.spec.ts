import User from 'src/models/user';
import { login } from 'src/resolvers/mutations/user/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';

const TEST_JWT_SECRET = 'test-secret';

describe('login', () => {
  const mockUser = {
    _id: 'userId',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const originalEnv = { ...process.env };
    
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  afterEach(() => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('should login and return a token', async () => {
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve({ ...mockUser, password: 'hashedpassword' }),
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
    
    const result = await login({}, { email: 'test@example.com', password: 'password' });
    
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(typeof result).toBe('string');
    
    const decoded = jwt.verify(result, process.env.JWT_SECRET!) as { _id: string };
    expect(decoded._id).toBe('userId');
  });

  it('should throw if user not found', async () => {
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve(null),
    });
    await expect(login({}, { email: 'notfound@example.com', password: 'password' })).rejects.toThrow('Хэрэглэгч олдсонгүй');
  });

  it('should throw if password is invalid', async () => {
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve(mockUser),
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);
    await expect(login({}, { email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Нууц үг буруу байна');
  });

  it('should throw if email is empty', async () => {
    await expect(login({}, { email: '', password: 'password' })).rejects.toThrow(UserInputError);
  });

  it('should throw if password is empty', async () => {
    await expect(login({}, { email: 'test@example.com', password: '' })).rejects.toThrow(UserInputError);
  });

  it('should throw if email format is invalid', async () => {
    await expect(login({}, { email: 'invalid-email', password: 'password' })).rejects.toThrow(UserInputError);
  });

  it('should properly select password field in query', async () => {
    const selectSpy = jest.fn().mockResolvedValue(mockUser);
    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: selectSpy,
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

    await login({}, { email: 'test@example.com', password: 'password' });
    expect(selectSpy).toHaveBeenCalledWith('+password');
  });

  it('should throw if JWT_SECRET is not set', async () => {
    const { JWT_SECRET, ...envWithoutSecret } = process.env;
    process.env = envWithoutSecret;

    (jest.spyOn(User, 'findOne') as jest.Mock).mockReturnValue({
      select: () => Promise.resolve(mockUser),
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

    await expect(login({}, { email: 'test@example.com', password: 'password' })).rejects.toThrow('JWT_SECRET is not configured');
  });
});
