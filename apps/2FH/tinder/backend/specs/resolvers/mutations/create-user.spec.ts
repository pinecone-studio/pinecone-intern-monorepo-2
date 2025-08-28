import { sendUserVerificationLink } from 'src/utils/mail-handler';

import { User } from 'src/models';
import { createUser } from 'src/resolvers/mutations';
import { UserResponse, CreateUserInput } from 'src/generated';

import bcryptjs from 'bcryptjs';

jest.mock('src/models', () => ({
  User: { create: jest.fn() },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));

jest.mock('src/utils/mail-handler', () => ({
  sendUserVerificationLink: jest.fn(),
}));
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

    const mockReq = {
      nextUrl: {
        protocol: 'http:',
        host: 'localhost:3000',
      },
    };

    if (!createUser) throw new Error('createUser is undefined');
    const result = await createUser({}, { input: mockUserInput }, { req: mockReq as any }, {} as any);

    expect(bcryptjs.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockUserInput.email,
        password: 'hashedPassword123',
      })
    );

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockUserInput.email);

    expect(result).toEqual(UserResponse.Success);
    consoleSpy.mockRestore();
  });
});
