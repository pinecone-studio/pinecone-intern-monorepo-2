import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../src/models/user.model';
import { verifyNewPass } from '../../../src/resolvers/mutations/verify-newpass';
import crypto from 'crypto';

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
      await verifyNewPass!({}, { input: { password: 'newPass', resetToken: '11223344' } }, {}, {} as GraphQLResolveInfo);
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
    await verifyNewPass!({}, { input: { password: 'newPass', resetToken: '11223344' } }, {}, {} as GraphQLResolveInfo);
    expect(mockUserModel.password).toBe('newPass');
    expect(mockUserModel.save).toHaveBeenCalled();
  });
});
