import { verifyOtp } from '../../../../src/resolvers/mutations/auth/verify-otp';
import { GraphQLResolveInfo } from 'graphql';
import crypto from 'crypto';
import User from '../../../../src/models/user.model';
import { sendEmailWithLink } from '../../../..//src/utils/sent-recover-link';

jest.mock('../../../../src/models/user.model', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../../../src/utils/sent-recover-link', () => ({
  sendEmailWithLink: jest.fn(),
}));
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('hashed-reset-token'),
}));
describe('update user info', () => {
  it('should throw an error if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    try {
      await verifyOtp!({}, { input: { email: 'test@email.com', otp: '9989' } }, { userId: '2' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found'));
    }
  });
  it('should update user with reset token and send email', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@example.com',
      otp: '1234',
      passwordResetToken: '',
      passwordResetTokenExpire: null,
      save: jest.fn(),
    };
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    (crypto.randomBytes as jest.Mock).mockReturnValueOnce('reset-token');

    const result = await verifyOtp!({}, { input: { email: 'test@email.com', otp: '9989' } }, { userId: '2' }, {} as GraphQLResolveInfo);

    expect(crypto.createHash).toHaveBeenCalledWith('sha256');

    expect(mockUser.passwordResetToken).toBe('hashed-reset-token');
    expect(mockUser.passwordResetTokenExpire).toBeInstanceOf(Date);
    expect(mockUser.save).toHaveBeenCalled();

    expect(sendEmailWithLink).toHaveBeenCalledWith('test@email.com', 'reset-token');

    expect(result).toEqual({ message: 'success' });
  });
});
