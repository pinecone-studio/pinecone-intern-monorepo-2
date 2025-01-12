import { GraphQLResolveInfo } from 'graphql';
import { register } from '../../../../src/resolvers/mutations/user/register';

const input = { email: 'test@gmail.com', firstName: 'test', lastName: 'test', address: 'test', phone: 'test', password: 'test' };

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1' }),
    create: jest.fn().mockResolvedValue({ _id: '1' }),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('register', () => {
  it('should register', async () => {
    const response = await register!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
      },
      token: 'token',
    });
  });

  it('should not register', async () => {
    try {
      await register!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User already exists'));
    }
  });
});
