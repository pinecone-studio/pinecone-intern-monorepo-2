import { forgotPassword, verifyOtp, resetPassword } from 'src/resolvers/mutations/forgot-reset-password';
import { User } from 'src/models';
import { OtpToken } from 'src/models/otp-token';
import bcrypt from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { PasswordResetResponse } from 'src/generated';

jest.mock('src/models', () => ({ User: { findOne: jest.fn() } }));
jest.mock('src/models/otp-token', () => ({
  OtpToken: {
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn()
  }
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

describe('forgot-reset-password', () => {
  const mockContext = { req: {} as any, currentUser: undefined };
  const mockInfo = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('should return error when email not registered', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const result = await forgotPassword!({}, { input: { email: 'test@example.com' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('not registered');
    });

    it('should send OTP when email exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });
      (sendUserVerificationLink as jest.Mock).mockResolvedValue(123456);
      (OtpToken.findOneAndDelete as jest.Mock).mockResolvedValue({});
      (OtpToken.create as jest.Mock).mockResolvedValue({});

      const result = await forgotPassword!({}, { input: { email: 'test@example.com' } }, mockContext, mockInfo);

      expect(result.status).toBe(PasswordResetResponse.Success);
      expect(result.message).toContain('OTP sent');
    });

    it('should handle errors gracefully', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      const result = await forgotPassword!({}, { input: { email: 'test@example.com' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('Internal');
    });
  });

  describe('verifyOtp', () => {
    it('should return error when OTP not found', async () => {
      (OtpToken.findOne as jest.Mock).mockResolvedValue(null);
      const result = await verifyOtp!({}, { input: { email: 'test@example.com', otp: '123456' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('not found');
    });

    it('should return error when OTP incorrect', async () => {
      (OtpToken.findOne as jest.Mock).mockResolvedValue({ 
        otp: '999999', 
        expiresAt: new Date(Date.now() + 60000) 
      });
      const result = await verifyOtp!({}, { input: { email: 'test@example.com', otp: '123456' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('Incorrect');
    });

    it('should return error when OTP expired', async () => {
      (OtpToken.findOne as jest.Mock).mockResolvedValue({ 
        otp: '123456', 
        expiresAt: new Date(Date.now() - 60000) 
      });
      const result = await verifyOtp!({}, { input: { email: 'test@example.com', otp: '123456' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('expired');
    });

    it('should return success when OTP is valid', async () => {
      (OtpToken.findOne as jest.Mock).mockResolvedValue({ 
        otp: '123456', 
        expiresAt: new Date(Date.now() + 60000) 
      });
      const result = await verifyOtp!({}, { input: { email: 'test@example.com', otp: '123456' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Success);
      expect(result.message).toContain('verified');
    });

    it('should handle errors gracefully', async () => {
      (OtpToken.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      const result = await verifyOtp!({}, { input: { email: 'test@example.com', otp: '123456' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('Internal');
    });
  });

  describe('resetPassword', () => {
    it('should return error when user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const result = await resetPassword!({}, { input: { email: 'test@example.com', newPassword: 'newpass123' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('User not found');
    });

    it('should reset password successfully', async () => {
      const mockUser = { 
        password: 'oldpass', 
        save: jest.fn().mockResolvedValue({}) 
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (OtpToken.deleteOne as jest.Mock).mockResolvedValue({});

      const result = await resetPassword!({}, { input: { email: 'test@example.com', newPassword: 'newpass123' } }, mockContext, mockInfo);

      expect(result.status).toBe(PasswordResetResponse.Success);
      expect(result.message).toContain('reset successfully');
    });

    it('should handle errors gracefully', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      const result = await resetPassword!({}, { input: { email: 'test@example.com', newPassword: 'newpass123' } }, mockContext, mockInfo);
      expect(result.status).toBe(PasswordResetResponse.Error);
      expect(result.message).toContain('Internal');
    });
  });
}); 