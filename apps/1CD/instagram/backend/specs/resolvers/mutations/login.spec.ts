import { GraphQLResolveInfo } from 'graphql';
import { login } from '../../../src/resolvers/mutations/login';

jest.mock('../../../src/models/user.model', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce({ _id: '1' }).mockResolvedValueOnce(null),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('login', () => {
  it('should login', async () => {
    const response = await login!({}, { input: { email: '', password: '' } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
      },
      token: 'token',
    });
  });

  it('should not login', async () => {
    try {
      await login!({}, { input: { email: '', password: '' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid credentials'));
    }
  });
});
