import { loginUser } from 'src/resolvers/mutations/user/login-user-mutation';
import { User } from 'src/models';
import { decryptHash } from 'src/utils';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

jest.mock('src/models');
jest.mock('src/utils');
jest.mock('src/utils/check-jwt', () => ({
  getJwtSecret: jest.fn(() => 'test-secret-key')
}));
jest.mock('jsonwebtoken');

const mockUser = User as jest.Mocked<typeof User>;
const mockDecryptHash = decryptHash as jest.MockedFunction<typeof decryptHash>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockUserId = '507f1f77bcf86cd799439011';
const mockUserName = 'testuser';
const mockEmail = 'test@example.com';
const mockPassword = 'hashedPassword123';
const mockToken = 'mock-jwt-token';
const createMockUserDocument = () => ({
  _id: { toString: () => mockUserId },
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
describe('loginUser', () => {
  let mockUserDocument: ReturnType<typeof createMockUserDocument>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument();
    mockJwt.sign.mockReturnValue(mockToken as never);
  });
  describe('successful login', () => {
    beforeEach(() => {
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockReturnValue(true);
    });
    it('should login user with email successfully', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };
      const result = await loginUser(null, { input });
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockDecryptHash).toHaveBeenCalledWith('plainPassword', mockPassword);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId, userName: mockUserName },
        'test-secret-key',
        { expiresIn: '100d', algorithm: 'HS256' }
      );
      expect(result.user).not.toHaveProperty('password');
      expect(result).toEqual({
        user: expect.objectContaining({
          _id: mockUserId,
          userName: mockUserName,
          email: mockEmail
        }),
        token: mockToken
      });
    });
    it('should login user with username successfully', async () => {
      const input = { identifier: 'testuser', password: 'plainPassword' }; 
      const result = await loginUser(null, { input });
      expect(mockUser.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
      expect(result.token).toBe(mockToken);
      expect(result.user.userName).toBe(mockUserName);
    });
    it('should handle email with mixed case and whitespace', async () => {
      const input = { identifier: '  Test@Example.COM  ', password: 'plainPassword' };     
      await loginUser(null, { input });
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
    it('should handle username with mixed case and whitespace', async () => {
      const input = { identifier: '  TestUser  ', password: 'plainPassword' };
      await loginUser(null, { input });
      expect(mockUser.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
    });
  });
  describe('authentication failures', () => {
    it('should throw error when user not found', async () => {
      const input = { identifier: 'nonexistent@example.com', password: 'plainPassword' };
      mockUser.findOne.mockResolvedValue(null);
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        })
      );
      expect(mockDecryptHash).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
    it('should throw error when password is invalid', async () => {
      const input = { identifier: 'test@example.com', password: 'wrongPassword' };
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockReturnValue(false);
      await expect(loginUser(null, { input })).rejects.toThrow(
        new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' }
        })
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
    it('should throw error when decryptHash throws an error', async () => {
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
  describe('JWT token generation', () => {
    beforeEach(() => {
      mockUser.findOne.mockResolvedValue(mockUserDocument as never);
      mockDecryptHash.mockReturnValue(true);
    });
    it('should generate token with correct parameters', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };     
      await loginUser(null, { input });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId, userName: mockUserName },
        'test-secret-key',
        { expiresIn: '100d', algorithm: 'HS256' }
      );
    });
    it('should handle user ID as ObjectId', async () => {
      const input = { identifier: 'test@example.com', password: 'plainPassword' };     
      await loginUser(null, { input });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          userName: mockUserName
        }),
        'test-secret-key',
        expect.objectContaining({ expiresIn: '100d' })
      );
    });
  });
});