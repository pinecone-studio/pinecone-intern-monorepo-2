import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../src/models/user.model';
import { verifyNewPass } from '../../../src/resolvers/mutations/auth/verify-newpass';
import { Context } from 'src/types';
import bcrypt from 'bcrypt';

jest.mock('../../../src/models/user.model', () => ({ userModel: { findOne: jest.fn() } }));
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('hashedResetToken'),
}));
jest.mock('bcrypt', () => ({ hash: jest.fn().mockResolvedValue('hashedNewPassword') }));

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
      password: 'prevPassword',
      save: jest.fn(),
    };
    (userModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserModel);
    // expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedNewPassword');
    const mockedContext: Context = { userId: 'mockedUserId' };
    await verifyNewPass!({}, { input: { password: 'newPass', resetToken: '11223344' } }, mockedContext, {} as GraphQLResolveInfo);
    expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
    expect(mockUserModel.password).toBe('hashedNewPassword');
    expect(mockUserModel.save).toHaveBeenCalled();
  });
});

bcrypt.hash as jest.Mock;
