// __tests__/create-user.test.ts
import { createUser } from 'src/resolvers/mutations/create-user';
import { UserResponse } from 'src/generated';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';

jest.mock('bcryptjs');
jest.mock('src/models', () => ({ User: { create: jest.fn() } }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

const mockHash = bcryptjs.hash as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockSendLink = sendUserVerificationLink as jest.Mock;

const ctx = {
  req: {
    nextUrl: { protocol: 'https:', host: 'example.com' },
  },
};

describe('createUser resolver', () => {
  const input = { email: 'test@example.com', password: '123456' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user successfully and sends verification link', async () => {
    mockHash.mockResolvedValue('hashed_pw');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    const result = await (createUser as any)({}, { input }, ctx as any);

    expect(mockHash).toHaveBeenCalledWith(input.password, 10);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: input.email,
        password: 'hashed_pw',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(mockSendLink).toHaveBeenCalledWith(
      'https://example.com',
      input.email
    );
    expect(result).toBe(UserResponse.Success);
  });

  it('throws GraphQLError when GraphQLError is thrown', async () => {
    mockHash.mockRejectedValue(new GraphQLError('GraphQL fail'));

    await expect((createUser as any)({}, { input }, ctx as any)).rejects.toThrow(
      GraphQLError
    );
  });

  it('wraps normal Error into GraphQLError', async () => {
    mockHash.mockRejectedValue(new Error('Normal fail'));

    await expect((createUser as any)({}, { input }, ctx as any)).rejects.toThrow(
      /Normal fail/
    );
  });

  it('throws Unknown error when error is not instance of Error', async () => {
    mockHash.mockRejectedValue('random string');

    await expect((createUser as any)({}, { input }, ctx as any)).rejects.toThrow(
      /Unknown error/
    );
  });
});
