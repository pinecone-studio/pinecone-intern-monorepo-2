import { GraphQLResolveInfo } from 'graphql';
import { login } from '../../../../src/resolvers/mutations/user/login';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce({ _id: '1' }).mockResolvedValueOnce(null),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('login', () => {
  const input = { email: 'demo@gmail.com', password: 'demo1234' };
  it('should login', async () => {
    const response = await login!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
      },
      token: 'token',
    });
  });

  it('should not login', async () => {
    try {
      await login!({}, { input: { email: 'test@gmail.com', password: 'test1234' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid credentials'));
    }
  });
});
