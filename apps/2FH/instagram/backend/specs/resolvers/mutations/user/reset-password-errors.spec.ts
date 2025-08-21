import { resetPassword } from 'src/resolvers/mutations/user';
import { User } from 'src/models';
import { encryptHash } from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user';
import { GraphQLError } from 'graphql';
jest.mock('src/models');
jest.mock('src/utils');
const mockUser = jest.mocked(User);
const mockEncryptHash = jest.mocked(encryptHash);
describe('Reset Password - Error Tests', () => {
  const validInput = {
    identifier: 'testuser@example.com',
    otp: '123456',
    newPassword: 'newSecurePassword123'
  };
  const mockUserDoc = {
    _id: 'user123',
    email: 'testuser@example.com',
    userName: 'testuser',
    fullName: 'Test User'
  };
  beforeEach(() => {
    jest.clearAllMocks();
    otpStorage.clear();
  });
  describe('User Not Found Errors', () => {
    it('should throw error when user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' }
        })
      );
    });
  });
  describe('OTP Validation Errors', () => {
    beforeEach(() => {
      mockUser.findOne.mockResolvedValue(mockUserDoc);
    });
    it('should throw error when OTP not found', async () => {
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('OTP not found or expired', {
          extensions: { code: 'OTP_NOT_FOUND' }
        })
      );
    });
    it('should throw error when OTP has expired', async () => {
      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() - 1000 // Expired 1 second ago
      });
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('OTP has expired', {
          extensions: { code: 'OTP_EXPIRED' }
        })
      );
      expect(otpStorage.has('testuser@example.com')).toBe(false);
    });
    it('should throw error when OTP is invalid', async () => {
      otpStorage.set('testuser@example.com', {
        otp: '654321', // Different OTP
        expiresAt: Date.now() + 10 * 60 * 1000
      });
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('Invalid OTP', {
          extensions: { code: 'INVALID_OTP' }
        })
      );
    });
  });
  describe('Password Validation Errors', () => {
    beforeEach(() => {
      mockUser.findOne.mockResolvedValue(mockUserDoc);
      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });
    });
    it('should throw error for empty password', async () => {
      const inputWithEmptyPassword = { ...validInput, newPassword: '' };
      await expect(
        resetPassword(null, { input: inputWithEmptyPassword })
      ).rejects.toThrow(
        new GraphQLError('Password must be at least 6 characters long', {
          extensions: { code: 'INVALID_PASSWORD' }
        })
      );
    });
    it('should throw error for undefined password', async () => {
      const inputWithUndefinedPassword = { 
        ...validInput, 
        newPassword: undefined as any 
      };
      await expect(
        resetPassword(null, { input: inputWithUndefinedPassword })
      ).rejects.toThrow(
        new GraphQLError('Password must be at least 6 characters long', {
          extensions: { code: 'INVALID_PASSWORD' }
        })
      );
    });
  });
  describe('Database Update Errors', () => {
    beforeEach(() => {
      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockEncryptHash.mockReturnValue('hashedPassword');
      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });
    });
    it('should throw error when password update fails', async () => {
      mockUser.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('Failed to update password', {
          extensions: { code: 'PASSWORD_UPDATE_FAILED' }
        })
      );
    });
  });
  describe('Email Requirements', () => {
    it('should throw error when username user has no email', async () => {
      const userWithoutEmail = { ...mockUserDoc, email: undefined };
      const inputWithUsername = { ...validInput, identifier: 'testuser' };
      mockUser.findOne.mockResolvedValue(userWithoutEmail);
      await expect(
        resetPassword(null, { input: inputWithUsername })
      ).rejects.toThrow(
        new GraphQLError('Email required for password reset', {
          extensions: { code: 'EMAIL_REQUIRED' }
        })
      );
    });
  });
  describe('Generic Error Handling', () => {
    it('should handle unexpected database errors', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database connection failed'));
      await expect(
        resetPassword(null, { input: validInput })
      ).rejects.toThrow(
        new GraphQLError('Password reset failed', {
          extensions: { code: 'PASSWORD_RESET_FAILED' }
        })
      );
    });
  });
});