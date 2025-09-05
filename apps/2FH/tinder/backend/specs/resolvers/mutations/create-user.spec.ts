import { User } from 'src/models';
import { createUser } from 'src/resolvers/mutations';
import { UserResponse, CreateUserInput } from 'src/generated';

import bcryptjs from 'bcryptjs';

jest.mock('src/models', () => ({
  User: { create: jest.fn() },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
describe('createUser mutation', () => {
  const mockUserInput: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user successfully', async () => {
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    (User.create as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      email: mockUserInput.email,
      password: 'hashedPassword123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser!({}, { input: mockUserInput }, {} as any, {} as any);

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(result).toEqual(UserResponse.Success);
    consoleSpy.mockRestore();
  });
});
