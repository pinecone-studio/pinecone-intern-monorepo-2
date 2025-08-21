import { verifyOTP } from 'src/resolvers/mutations/user/verify-otp-mutation';
import { User } from 'src/models';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';
import { GraphQLError } from 'graphql';
jest.mock('src/models');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation');
const mockUser = User as jest.Mocked<typeof User>;
describe('verifyOTP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    otpStorage.clear();
  });
  describe('successful verification', () => {
    it('should verify OTP with email identifier', async () => {
      const email = 'test@example.com';
      const otp = '123456';     
      mockUser.findOne.mockResolvedValue({ email, userName: 'testuser' });
      otpStorage.set(email, { otp, expiresAt: Date.now() + 300000 });
      const result = await verifyOTP(null, { identifier: email, otp });      
      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({ email });
    });
    it('should verify OTP with username identifier', async () => {
      const userName = 'testuser';
      const email = 'test@example.com';
      const otp = '123456';      
      mockUser.findOne.mockResolvedValue({ email, userName });
      otpStorage.set(email, { otp, expiresAt: Date.now() + 300000 });
      const result = await verifyOTP(null, { identifier: userName, otp });      
      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({ userName });
    });
  });
  describe('error scenarios', () => {
    it('should throw error when user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);
      await expect(
        verifyOTP(null, { identifier: 'nonexistent', otp: '123456' })
      ).rejects.toThrow(new GraphQLError('User not found', {
        extensions: { code: 'USER_NOT_FOUND' }
      }));
    });
    it('should throw error when OTP not found', async () => {
      const email = 'test@example.com';     
      mockUser.findOne.mockResolvedValue({ email, userName: 'testuser' });
      await expect(
        verifyOTP(null, { identifier: email, otp: '123456' })
      ).rejects.toThrow(new GraphQLError('OTP not found or expired', {
        extensions: { code: 'OTP_NOT_FOUND' }
      }));
    });
    it('should throw error when OTP expired', async () => {
      const email = 'test@example.com';
      const otp = '123456';     
      mockUser.findOne.mockResolvedValue({ email, userName: 'testuser' });
      otpStorage.set(email, { otp, expiresAt: Date.now() - 1000 });
      await expect(
        verifyOTP(null, { identifier: email, otp })
      ).rejects.toThrow(new GraphQLError('OTP has expired', {
        extensions: { code: 'OTP_EXPIRED' }
      }));
    });
    it('should throw error when OTP invalid', async () => {
      const email = 'test@example.com';     
      mockUser.findOne.mockResolvedValue({ email, userName: 'testuser' });
      otpStorage.set(email, { otp: '123456', expiresAt: Date.now() + 300000 });
      await expect(
        verifyOTP(null, { identifier: email, otp: '654321' })
      ).rejects.toThrow(new GraphQLError('Invalid OTP', {
        extensions: { code: 'INVALID_OTP' }
      }));
    });
    it('should throw error when email required for username', async () => {
      const userName = 'testuser';      
      mockUser.findOne.mockResolvedValue({ userName });
      await expect(
        verifyOTP(null, { identifier: userName, otp: '123456' })
      ).rejects.toThrow(new GraphQLError('Email required for OTP verification', {
        extensions: { code: 'EMAIL_REQUIRED' }
      }));
    });
    it('should handle unexpected errors', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await expect(
        verifyOTP(null, { identifier: 'test@example.com', otp: '123456' })
      ).rejects.toThrow(new GraphQLError('OTP verification failed', {
        extensions: { code: 'OTP_VERIFICATION_FAILED' }
      }));
    });
  });
  describe('case sensitivity and trimming', () => {
    it('should handle case insensitive email', async () => {
      const email = 'Test@Example.com';
      const otp = '123456';
      
      mockUser.findOne.mockResolvedValue({ email: email.toLowerCase(), userName: 'testuser' });
      otpStorage.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 300000 });

      const result = await verifyOTP(null, { identifier: email, otp });
      
      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should handle case insensitive username', async () => {
      const userName = 'TestUser';
      const email = 'test@example.com';
      const otp = '123456';
      
      mockUser.findOne.mockResolvedValue({ email, userName: userName.toLowerCase() });
      otpStorage.set(email, { otp, expiresAt: Date.now() + 300000 });

      const result = await verifyOTP(null, { identifier: userName, otp });
      
      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
    });
  });

  describe('OTP cleanup', () => {
    it('should remove expired OTP from storage', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      
      mockUser.findOne.mockResolvedValue({ email, userName: 'testuser' });
      otpStorage.set(email, { otp, expiresAt: Date.now() - 1000 });

      await expect(
        verifyOTP(null, { identifier: email, otp })
      ).rejects.toThrow();

      expect(otpStorage.has(email)).toBe(false);
    });
  });
});