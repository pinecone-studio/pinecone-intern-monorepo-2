import { loginUser } from 'src/resolvers/mutations/user/login-user-mutation';
import { User } from 'src/models';
import { decryptHash } from 'src/utils';
import { getJwtSecret } from 'src/utils/check-jwt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

jest.mock('src/models');
jest.mock('src/utils');
jest.mock('src/utils/check-jwt');
jest.mock('jsonwebtoken');

const mockUser = User as jest.Mocked<typeof User>;
const mockDecryptHash = decryptHash as jest.MockedFunction<typeof decryptHash>;
const mockGetJwtSecret = getJwtSecret as jest.MockedFunction<typeof getJwtSecret>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockJwtSecret = 'test-secret-key';
const mockUserId = '507f1f77bcf86cd799439011';
const mockUserName = 'testuser';
const mockEmail = 'test@example.com';
const mockPassword = 'hashedPassword123';
const mockToken = 'mock-jwt-token';
const createMockUserDocument = () => ({
  _id: mockUserId,
  userName: mockUserName,
  email: mockEmail,
  password: mockPassword,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject: jest.fn().mockReturnValue({
    _id: mockUserId,
    userName: mockUserName,
    email: mockEmail,
    password: mockPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  })
});
describe('loginUser - Error Handling', () => {
  let mockUserDocument: ReturnType<typeof createMockUserDocument>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument();
    mockGetJwtSecret.mockReturnValue(mockJwtSecret);
    mockJwt.sign.mockReturnValue(mockToken as never);
  });
  describe('system errors', () => {
    it('should handle database errors gracefully', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      mockUser.findOne.mockRejectedValue(new Error('Database connection failed'));
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Login failed', {
          extensions: { code: 'LOGIN_FAILED' }
        })
      );
    });
    it('should handle JWT signing errors', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockReturnValue(true);
      mockJwt.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Login failed', {
          extensions: { code: 'LOGIN_FAILED' }
        })
      );
    });
    it('should handle toObject method errors', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockReturnValue(true);
      mockUserDocument.toObject.mockImplementation(() => {
        throw new Error('toObject failed');
      });
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Login failed', {
          extensions: { code: 'LOGIN_FAILED' }
        })
      );
    });
    it('should re-throw GraphQLErrors without wrapping', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      const originalError = new GraphQLError('Custom error', {
        extensions: { code: 'CUSTOM_ERROR' }
      });
      mockUser.findOne.mockRejectedValue(originalError);
      await expect(loginUser(null, { input })).rejects.toThrow(originalError);
    });
    it('should handle decryptHash throwing an error', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockImplementation(() => {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        });
      });
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        })
      );
    });
  });
  describe('edge cases', () => {
    it('should handle empty identifier', async () => {
      const input = { identifier: '', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(null);
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        })
      );
    });
    it('should handle identifier with only whitespace', async () => {
      const input = { identifier: '   ', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(null);
      await expect(loginUser(null, { input })).rejects.toThrow();
      expect(mockUser.findOne).toHaveBeenCalledWith({ userName: '' });
    });
    it('should handle user object without expected fields', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      const incompleteUser = {
        _id: mockUserId,
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          password: mockPassword
        })
      };
      mockUser.findOne.mockResolvedValue(incompleteUser as never);
      mockDecryptHash.mockReturnValue(true);
      const result = await loginUser(null, { input });
      expect(result.user).toEqual({ _id: mockUserId });
      expect(result.user).not.toHaveProperty('password');
    });
  });
  describe('authentication edge cases', () => {
    it('should handle missing password field in user document', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      const userWithoutPassword = {
        ...mockUserDocument,
        password: undefined,
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          userName: mockUserName,
          email: mockEmail
        })
      };
      mockUser.findOne.mockResolvedValue(userWithoutPassword as never);
      mockDecryptHash.mockReturnValue(false);
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        })
      );
    });
  });
});