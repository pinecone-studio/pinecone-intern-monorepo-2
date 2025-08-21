import { resetPassword } from 'src/resolvers/mutations/user';
import { User } from 'src/models';
import { encryptHash } from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user';
import { GraphQLError } from 'graphql';

jest.mock('src/models');
jest.mock('src/utils');

const mockUser = jest.mocked(User);
const mockEncryptHash = jest.mocked(encryptHash);

describe('Reset Password - Main Tests', () => {
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

  describe('Successful Password Reset', () => {
    it('should reset password with valid email identifier', async () => {
      const hashedPassword = 'hashedNewPassword';
      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...mockUserDoc,
        password: hashedPassword
      });
      mockEncryptHash.mockReturnValue(hashedPassword);
      
      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      const result = await resetPassword(null, { input: validInput });

      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: 'testuser@example.com'
      });
      expect(mockEncryptHash).toHaveBeenCalledWith('newSecurePassword123');
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { password: hashedPassword },
        { new: true }
      );
      expect(otpStorage.has('testuser@example.com')).toBe(false);
    });

    it('should reset password with valid username identifier', async () => {
      const inputWithUsername = {
        ...validInput,
        identifier: 'testuser'
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...mockUserDoc,
        password: 'hashedPassword'
      });
      mockEncryptHash.mockReturnValue('hashedPassword');

      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      const result = await resetPassword(null, { input: inputWithUsername });

      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({
        userName: 'testuser'
      });
    });

    it('should handle case-insensitive identifiers', async () => {
      const inputWithUpperCase = {
        ...validInput,
        identifier: 'TESTUSER@EXAMPLE.COM'
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...mockUserDoc,
        password: 'hashedPassword'
      });
      mockEncryptHash.mockReturnValue('hashedPassword');

      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      const result = await resetPassword(null, { input: inputWithUpperCase });

      expect(result).toBe(true);
      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: 'testuser@example.com'
      });
    });

    it('should properly clean up OTP after successful reset', async () => {
      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...mockUserDoc,
        password: 'hashedPassword'
      });
      mockEncryptHash.mockReturnValue('hashedPassword');

      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      await resetPassword(null, { input: validInput });

      expect(otpStorage.has('testuser@example.com')).toBe(false);
    });

    it('should validate minimum password length', async () => {
      const inputWithShortPassword = {
        ...validInput,
        newPassword: '12345'
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);

      otpStorage.set('testuser@example.com', {
        otp: '123456',
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      await expect(
        resetPassword(null, { input: inputWithShortPassword })
      ).rejects.toThrow(GraphQLError);
    });
  });
});