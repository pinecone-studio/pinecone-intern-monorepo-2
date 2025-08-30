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

interface MockUserDocument {
  _id: string;
  userName: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  toObject: jest.MockedFunction<() => Record<string, unknown>>;
}

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

const createMockUserDocument = (isVerified = true): MockUserDocument => ({
  _id: mockUserId,
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

describe('loginUser - System Errors', () => {
  let mockUserDocument: MockUserDocument;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument(true);
    mockGetJwtSecret.mockReturnValue(mockJwtSecret);
    mockJwt.sign.mockReturnValue(mockToken as never);
  });
  
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
});