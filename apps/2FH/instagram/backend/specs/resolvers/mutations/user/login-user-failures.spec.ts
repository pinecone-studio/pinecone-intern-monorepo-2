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

interface MockUserDocument {
  _id: { toString: () => string };
  userName: string;
  email?: string;
  password: string;
  isVerified: boolean;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  toObject: jest.MockedFunction<() => Record<string, unknown>>;
}

const mockUser = User as jest.Mocked<typeof User>;
const mockDecryptHash = decryptHash as jest.MockedFunction<typeof decryptHash>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockUserId = '507f1f77bcf86cd799439011';
const mockUserName = 'testuser';
const mockEmail = 'test@example.com';
const mockPassword = 'hashedPassword123';
const mockToken = 'mock-jwt-token';

const createMockUserDocument = (isVerified = true): MockUserDocument => ({
  _id: { toString: () => mockUserId },
  userName: mockUserName,
  email: mockEmail,
  password: mockPassword,
  isVerified,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject: jest.fn().mockReturnValue({
    _id: mockUserId,
    userName: mockUserName,
    email: mockEmail,
    password: mockPassword,
    isVerified,
    createdAt: new Date(),
    updatedAt: new Date()
  })
});

describe('loginUser - Authentication Failures', () => {
  let mockUserDocument: MockUserDocument;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument(true);
    mockJwt.sign.mockReturnValue(mockToken as never);
  });
  
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
  
  it('should throw error when user email is not verified', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    const unverifiedUser = createMockUserDocument(false);
    mockUser.findOne.mockResolvedValue(unverifiedUser as never);
    mockDecryptHash.mockReturnValue(true);
    
    await expect(loginUser(null, { input })).rejects.toThrow(
      new GraphQLError('Please verify your email address before logging in', {
        extensions: { 
          code: 'EMAIL_NOT_VERIFIED',
          email: mockEmail
        }
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
  it('should handle missing password field in user document', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    const userWithoutPassword: MockUserDocument = {
      ...mockUserDocument,
      password: undefined as any,
      toObject: jest.fn().mockReturnValue({
        _id: mockUserId,
        userName: mockUserName,
        email: mockEmail,
        isVerified: true
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