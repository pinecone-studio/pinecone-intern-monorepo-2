import { GraphQLError } from 'graphql';
import { User } from 'src/models';
import { generateOTP, sendOTPEmail } from 'src/utils';
import { forgotPassword } from 'src/resolvers/mutations/user/forgot-password-mutation';
jest.mock('src/models');
jest.mock('src/utils');
const mockedUser = User as jest.Mocked<typeof User>;
const mockedGenerateOTP = generateOTP as jest.MockedFunction<typeof generateOTP>;
const mockedSendOTPEmail = sendOTPEmail as jest.MockedFunction<typeof sendOTPEmail>;
type MockUser = {
  id: string;
  email?: string | null;
  userName: string;
}
describe('forgotPassword - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('validation errors', () => {
    it('should throw USER_NOT_FOUND error when user does not exist', async () => {
      mockedUser.findOne.mockResolvedValue(null);
      const input = { identifier: 'nonexistent@example.com' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' }
        }));
    });
    it('should throw EMAIL_REQUIRED error when user has no email property', async () => {
      const userWithoutEmail: Omit<MockUser, 'email'> & { email?: undefined } = { 
        id: '1', 
        userName: 'testuser' 
      };
      mockedUser.findOne.mockResolvedValue(userWithoutEmail);
      const input = { identifier: 'testuser' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Email required for password reset', {
          extensions: { code: 'EMAIL_REQUIRED' }
        }));
    });
    it('should throw EMAIL_REQUIRED error when email is empty string', async () => {
      const userWithEmptyEmail: MockUser = { 
        id: '1', 
        email: '', 
        userName: 'testuser' 
      };
      mockedUser.findOne.mockResolvedValue(userWithEmptyEmail);
      const input = { identifier: 'testuser' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Email required for password reset', {
          extensions: { code: 'EMAIL_REQUIRED' }
        }));});
    it('should throw EMAIL_REQUIRED error when email is null', async () => {
      const userWithNullEmail: MockUser = { 
        id: '1', 
        email: null, 
        userName: 'testuser' 
      };
      mockedUser.findOne.mockResolvedValue(userWithNullEmail);
      const input = { identifier: 'testuser' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Email required for password reset', {
          extensions: { code: 'EMAIL_REQUIRED' }
        }));});});
  describe('service errors', () => {
    it('should throw FORGOT_PASSWORD_FAILED when sendOTPEmail fails', async () => {
      const mockUser: MockUser = { 
        id: '1', 
        email: 'test@example.com',
        userName: 'testuser'
      };
      mockedUser.findOne.mockResolvedValue(mockUser);
      mockedGenerateOTP.mockReturnValue('123456');
      mockedSendOTPEmail.mockRejectedValue(new Error('Email service down'));
      const input = { identifier: 'test@example.com' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Failed to send reset email', {
          extensions: { code: 'FORGOT_PASSWORD_FAILED' }
        }));});
    it('should throw FORGOT_PASSWORD_FAILED when database query fails', async () => {
      mockedUser.findOne.mockRejectedValue(new Error('Database error'));
      const input = { identifier: 'test@example.com' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Failed to send reset email', {
          extensions: { code: 'FORGOT_PASSWORD_FAILED' }
        }));});
    it('should throw FORGOT_PASSWORD_FAILED when generateOTP fails', async () => {
      const mockUser: MockUser = { 
        id: '1', 
        email: 'test@example.com',
        userName: 'testuser'
      };
      mockedUser.findOne.mockResolvedValue(mockUser);
      mockedGenerateOTP.mockImplementation(() => {
        throw new Error('OTP generation failed');
      });
      const input = { identifier: 'test@example.com' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Failed to send reset email', {
          extensions: { code: 'FORGOT_PASSWORD_FAILED' }
        }));});
    it('should re-throw GraphQL errors without wrapping', async () => {
      mockedUser.findOne.mockRejectedValue(
        new GraphQLError('Custom error', {
          extensions: { code: 'CUSTOM_ERROR' }
        })
      );
      const input = { identifier: 'test@example.com' };
      await expect(forgotPassword(null, { input }))
        .rejects
        .toThrow(new GraphQLError('Custom error', {
          extensions: { code: 'CUSTOM_ERROR' }
        }));
    });});
  describe('edge cases', () => {
    beforeEach(() => {
      mockedGenerateOTP.mockReturnValue('123456');
      mockedSendOTPEmail.mockResolvedValue(undefined);
    });
    it('should handle identifier with @ but treat as email lookup', async () => {
      const mockUser: MockUser = { 
        id: '1', 
        email: 'test@example.com',
        userName: 'testuser'
      };
      mockedUser.findOne.mockResolvedValue(mockUser);
      const input = { identifier: 'invalid@' };
      const result = await forgotPassword(null, { input });
      expect(result).toBe(true);
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        email: 'invalid@'
      });
      expect(mockedSendOTPEmail).toHaveBeenCalledWith('invalid@', '123456');
    });
    it('should handle very long identifiers', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const mockUser: MockUser = { 
        id: '1', 
        email: longEmail,
        userName: 'testuser'
      };
      mockedUser.findOne.mockResolvedValue(mockUser);
      const input = { identifier: longEmail };
      const result = await forgotPassword(null, { input });
      expect(result).toBe(true);
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        email: longEmail
      });
    });
  });
});