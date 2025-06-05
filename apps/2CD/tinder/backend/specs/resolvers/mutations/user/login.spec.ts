import User from '../../../../src/models/user';
import { login } from '../../../../src/resolvers/mutations/user/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../../src/models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const TEST_JWT_SECRET = 'test-secret';

describe('login', () => {
  const baseInput = {
    email: 'test@example.com',
    password: 'password123',
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

  it('should login successfully', async () => {
    const hashedPassword = 'hashedPassword';
    const mockUser = { _id: 'user123', password: hashedPassword };
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token123');

    const result = await login({}, baseInput);
    expect(result).toBe('token123');
  });

  it('should throw if user not found', async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    await expect(login({}, baseInput)).rejects.toThrow('Хэрэглэгч одсонгүй');
  });

  it('should throw if password is invalid', async () => {
    const mockUser = { _id: 'user123', password: 'hashedPassword' };
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(login({}, baseInput)).rejects.toThrow('Нууц үг буруу байна');
  });

  it('should throw if email is empty', async () => {
    await expect(login({}, { email: '', password: 'password123' })).rejects.toThrow('Емэйл & нууц үг шаардлагатай');
  });

  it('should throw if password is empty', async () => {
    await expect(login({}, { email: 'test@example.com', password: '' })).rejects.toThrow('Емэйл & нууц үг шаардлагатай');
  });

  it('should throw if email format is invalid', async () => {
    await expect(login({}, { email: 'invalid-email', password: 'password' })).rejects.toThrow('Буруу емэйл хаяг');
  });

  it('should properly select password field in query', async () => {
    const selectSpy = jest.fn().mockResolvedValue({ _id: 'user123', password: 'hashedPassword' });
    (User.findOne as jest.Mock).mockReturnValue({
      select: selectSpy,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await login({}, baseInput);
    expect(selectSpy).toHaveBeenCalledWith('+password');
  });

  it('should throw if JWT_SECRET is not set', async () => {
    const { JWT_SECRET, ...envWithoutSecret } = process.env;
    process.env = envWithoutSecret;

    (User.findOne as jest.Mock).mockReturnValue({
      select: () => Promise.resolve({ _id: 'user123', password: 'hashedPassword' }),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(login({}, baseInput)).rejects.toThrow('JWT_SECRET is not configured');
  });
});
