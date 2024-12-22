import { recoverPassword } from '../../../../src/resolvers/mutations/auth/recover-password';
import { GraphQLResolveInfo } from 'graphql';
import crypto from 'crypto';
import User from '../../../../src/models/user.model';
import bcrypt from 'bcrypt';

jest.mock('../../../../src/models/user.model', () => ({
  findOneAndUpdate: jest.fn(),
}));

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('hashed-reset-token'),
  }),
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('update user info', () => {
  it('should throw an error if user is not found', async () => {
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    try {
      await recoverPassword!({}, { input: { password: 'newpassword', resetToken: '9989' } }, { userId: '2' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid or expired reset token'));
    }
    expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
  });

  it('should update user with reset token and return updated user', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@example.com',
      otp: '1234',
      passwordResetToken: 'resetToken',
      passwordResetTokenExpire: new Date(Date.now() + 5 * 60 * 1000),
      password: 'newpassword',
    };

    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await recoverPassword!({}, { input: { password: 'newpassword', resetToken: 'resetToken' } }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'success' });

    expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
  });
});
