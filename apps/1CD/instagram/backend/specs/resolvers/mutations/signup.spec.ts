import { GraphQLResolveInfo } from 'graphql';
import { signup } from '../../../src/resolvers/mutations/signup';

const input = { email: 'test@gmail.com', userName: 'test', fullName: 'test', password: 'test' };

jest.mock('../../../src/models/user.model', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1' }),
    create: jest.fn().mockResolvedValue({ _id: '1' }),
  },
}));

process.env.JWT_SECRET = 'test-secret';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('signup', () => {
  it('should signup', async () => {
    const response = await signup!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
      },
      token: 'token',
    });
  });

  it('should not register when user exists', async () => {
    try {
      await signup!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User already exists'));
    }
  });

  it('should throw error when JWT_SECRET is not set', async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      await signup!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('JWT_SECRET environment variable is not set'));
    }

    process.env.JWT_SECRET = originalSecret;
  });
});
