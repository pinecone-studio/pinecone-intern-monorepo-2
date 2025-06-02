import { User } from 'src/models/user.model';
import { createUser } from 'src/resolvers/mutations';
import bcrypt from 'bcryptjs';

jest.mock('src/models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('createUser', () => {
  const mockUserInput = {
    userName: 'testuser',
    email: 'existing@example.com',
    password: 'password123',
  };

  it('should throw error if user with the same email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: 'abc123',
      email: 'existing@example.com',
    });

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow('User already exist');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
  });
  jest.mock('bcryptjs');

  it('it should hash the password and salt round 10', async () => {
    const password = 'test123';
    const fakeHash = 'hashedPassword123';
    (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHash);

    const result = await bcrypt.hash(password, 10);

    expect(bcrypt.hash).toBeCalledWith(password, 10);
    expect(result).toBe(fakeHash);
  });

  it('it should create the user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    const input = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await createUser(null, { input });

    expect(User.create).toBeCalledWith({
      userName: input.userName,
      email: input.email,
      password: 'hashedPassword123',
      wallet: 0,
    });
  });
});
