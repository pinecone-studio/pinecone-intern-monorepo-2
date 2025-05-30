import { createUser } from 'src/resolvers/mutations/create-user';
import { User, UserRole } from 'src/models/user';
import jwt from 'jsonwebtoken';

jest.mock('src/models/user');

describe('createUser resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear env variable before each test for consistent results
    delete process.env.JWT_SECRET;
  });

  it('throws error if email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'existing-id' });

    await expect(
      createUser(null, {
        input: { email: 'dup@example.com', password: 'pass', phoneNumber: '123' },
      })
    ).rejects.toThrow('User already exist');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'dup@example.com' });
  });

  it('creates new user with default USER role and uses fallback JWT secret', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    (User.prototype.save as jest.Mock).mockResolvedValue({
      _id: 'new-id',
      email: 'new@example.com',
      phoneNumber: '123',
      role: UserRole.USER,
    });

    // Clear JWT_SECRET to test fallback
    delete process.env.JWT_SECRET;

    const signSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'dummy-token');

    const result = await createUser(null, {
      input: { email: 'new@example.com', password: 'pass', phoneNumber: '123' },
    });

    expect(result.user.email).toBe('new@example.com');
    expect(result.user.role).toBe(UserRole.USER); // default role
    expect(result.token).toBe('dummy-token');
    expect(signSpy).toHaveBeenCalledWith(
      { userId: 'new-id' },
      'test-secret',  // fallback secret used
      { expiresIn: '1d' }
    );
    expect(User.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it('creates new user with explicit role and environment JWT secret', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    (User.prototype.save as jest.Mock).mockResolvedValue({
      _id: 'new-id-2',
      email: 'admin@example.com',
      phoneNumber: '456',
      role: UserRole.ADMIN,
    });

    process.env.JWT_SECRET = 'real-secret';

    const signSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'real-token');

    const result = await createUser(null, {
      input: { email: 'admin@example.com', password: 'pass', phoneNumber: '456', role: UserRole.ADMIN },
    });

    expect(result.user.email).toBe('admin@example.com');
    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(result.token).toBe('real-token');
    expect(signSpy).toHaveBeenCalledWith(
      { userId: 'new-id-2' },
      'real-secret',
      { expiresIn: '1d' }
    );
    expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@example.com' });
    expect(User.prototype.save).toHaveBeenCalled();
  });
});
