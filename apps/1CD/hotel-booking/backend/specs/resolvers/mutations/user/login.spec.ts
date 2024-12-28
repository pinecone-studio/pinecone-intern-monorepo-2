import { GraphQLResolveInfo } from 'graphql';
import { login } from '../../../../src/resolvers/mutations/user/login';
import bcrypt from 'bcrypt';
import { userModel } from 'src/models';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

describe('login', () => {
  const input = { email: 'demo@gmail.com', password: 'demo1234' };

  it('should login', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValueOnce({ _id: '1', password: 'hashedPassword' });
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

    const response = await login!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
        password: 'hashedPassword',
      },
      token: 'token',
    });
  });

  it('should not login if email does not exist', async () => {
    try {
      await login!({}, { input: { email: 'test@gmail.com', password: 'test1234' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Email does not exist'));
    }
  });
  it('should throw an error if password does not match', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValueOnce({ _id: '1', password: 'hashedPassword' });

    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);

    try {
      await login!({}, { input: { email: 'test@example.com', password: 'wrongPassword' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Wrong password'));
    }
  });
});
