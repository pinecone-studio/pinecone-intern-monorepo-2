import { verifyEmailOTP } from 'src/resolvers/mutations/user/verify-email-otp-mutation';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockUser = User as jest.Mocked<typeof User>;
const mockOtpStorage = otpStorage as jest.Mocked<Map<string, { otp: string; expiresAt: number }>>;

describe('verifyEmailOTP - Error Handling', () => {
  const validEmail = 'test@example.com';
  const validOTP = '123456';
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
  });

  describe('OTP validation errors', () => {
    beforeEach(() => {
      mockUser.findOneAndUpdate.mockResolvedValue({
        _id: mockUserId,
        email: validEmail,
        isVerified: true
      } as never);
    });

    it('should throw error when OTP not found', async () => {
      // No OTP stored for this email
      await expect(verifyEmailOTP(null, { 
        email: 'notfound@example.com', 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('Verification OTP not found or expired', {
          extensions: { code: 'VERIFICATION_OTP_NOT_FOUND' }
        })
      );
    });

    it('should throw error when OTP is expired', async () => {
      mockOtpStorage.set('verification_test@example.com', {
        otp: validOTP,
        expiresAt: Date.now() - 1000 // 1 second ago (expired)
      });

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('Verification OTP has expired', {
          extensions: { code: 'VERIFICATION_OTP_EXPIRED' }
        })
      );

      // Should remove expired OTP from storage
      expect(mockOtpStorage.has('verification_test@example.com')).toBe(false);
    });

    it('should throw error when OTP is incorrect', async () => {
      mockOtpStorage.set('verification_test@example.com', {
        otp: '654321', // Different OTP
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('Invalid verification OTP', {
          extensions: { code: 'INVALID_VERIFICATION_OTP' }
        })
      );

      // Should not remove OTP from storage when incorrect
      expect(mockOtpStorage.has('verification_test@example.com')).toBe(true);
    });
  });

  describe('User update errors', () => {
    beforeEach(() => {
      mockOtpStorage.set('verification_test@example.com', {
        otp: validOTP,
        expiresAt: Date.now() + 5 * 60 * 1000
      });
    });

    it('should throw error when user not found', async () => {
      mockUser.findOneAndUpdate.mockResolvedValue(null);

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' }
        })
      );

      // OTP should still be deleted even if user update fails
      expect(mockOtpStorage.has('verification_test@example.com')).toBe(false);
    });

    it('should handle database errors during user update', async () => {
      mockUser.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('Email OTP verification failed', {
          extensions: { code: 'EMAIL_OTP_VERIFICATION_FAILED' }
        })
      );
    });

    it('should re-throw GraphQLErrors without wrapping', async () => {
      const originalError = new GraphQLError('Custom verification error', {
        extensions: { code: 'CUSTOM_ERROR' }
      });
      
      mockUser.findOneAndUpdate.mockRejectedValue(originalError);

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(originalError);
    });

    it('should wrap non-GraphQL errors', async () => {
      mockUser.findOneAndUpdate.mockRejectedValue(new TypeError('Unexpected error'));

      await expect(verifyEmailOTP(null, { 
        email: validEmail, 
        otp: validOTP 
      })).rejects.toThrow(
        new GraphQLError('Email OTP verification failed', {
          extensions: { code: 'EMAIL_OTP_VERIFICATION_FAILED' }
        })
      );
    });
  });
})