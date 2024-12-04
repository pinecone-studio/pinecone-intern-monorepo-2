import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../src/models/user.model';
import { verifyNewPass } from '../../../src/resolvers/mutations/auth/verify-newpass';
import crypto from 'crypto';
import { Context } from 'src/types';

jest.mock('../../../src/models/user.model', () => ({ userModel: { findOne: jest.fn() } }));

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('hashedResetToken'),
}));

describe('verify-new-password', () => {
  it('should throw error, if password recovery period has expired', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    try {
      const mockedContext: Context = { userId: 'mockedUserId' };
      await verifyNewPass!({}, { input: { password: 'newPass', resetToken: '11223344' } }, mockedContext, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Your password recovery period has expired.'));
    }
  });
  it('should update password using reset token', async () => {
    const mockUserModel = {
      _id: '1',
      email: 'test@gmail.com',
      resetPasswordToken: 'resetToken',
      resetPasswordTokenExpire: new Date(Date.now() + 3 * 60 * 1000),
      password: 'newPassword',
      save: jest.fn(),
    };
    (userModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserModel);
    expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    const mockedContext: Context = { userId: 'mockedUserId' };
    await verifyNewPass!({}, { input: { password: 'newPass', resetToken: '11223344' } }, mockedContext, {} as GraphQLResolveInfo);
    expect(mockUserModel.password).toBe('newPass');
    expect(mockUserModel.save).toHaveBeenCalled();
  });
});
