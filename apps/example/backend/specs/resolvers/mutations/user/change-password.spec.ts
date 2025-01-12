import { GraphQLResolveInfo } from 'graphql';
import { changePassword } from '../../../../src/resolvers/mutations/user/change-password';
import { Response } from 'src/generated';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce({ _id: '1', otp: '1111' }).mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1', otp: '1111' }),
    updateOne: jest.fn().mockResolvedValueOnce({}),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

describe('Change password', () => {
  it('should change', async () => {
    const response = await changePassword!({}, { input: { email: '', password: '', otp: '1111' } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual(Response.Success);
  });

  it('should throw user not found error', async () => {
    try {
      await changePassword!({}, { input: { email: '', password: '', otp: '1111' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found'));
    }
  });

  it('should throw invalid otp error', async () => {
    try {
      await changePassword!({}, { input: { email: '', password: '', otp: '1112' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid OTP'));
    }
  });
});
