import { GraphQLResolveInfo } from 'graphql';
import { signUp } from '../../../../src/resolvers/mutations';

const input = { email: 'test@gmail.com', firstName: 'test', lastName: 'test', phoneNumber: 'test', password: 'test1234' };

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1' }),
    create: jest.fn().mockResolvedValue({ _id: '1' }),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('signUp', () => {
  it('should signUp', async () => {
    const response = await signUp!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      user: {
        _id: '1',
      },
      token: 'token',
    });
  });

  it('should not signUp', async () => {
    try {
      await signUp!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User already exists'));
    }
  });
});
