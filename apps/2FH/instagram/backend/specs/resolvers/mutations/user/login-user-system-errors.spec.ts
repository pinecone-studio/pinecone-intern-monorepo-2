//login-user-system-errors.spec.ts
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
  _id: { toString: () => string };
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

describe('loginUser - System Errors', () => {
  let mockUserDocument: MockUserDocument;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument(true);
    mockGetJwtSecret.mockReturnValue(mockJwtSecret);
    mockJwt.sign.mockReturnValue(mockToken as never);
    mockDecryptHash.mockReturnValue(true);
  });

  it('should handle database errors gracefully', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Mock User.findOne to throw an error
    mockUser.findOne.mockImplementation(() => {
      throw new Error('Database connection failed');
    });
    
    await expect(loginUser(null, { input })).rejects.toThrow('Login failed');
  });

  it('should handle JWT signing errors', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Mock successful user lookup
    mockUser.findOne.mockResolvedValue(mockUserDocument as any);
    
    // Mock JWT signing to throw an error
    mockJwt.sign.mockImplementation(() => {
      throw new Error('JWT signing failed');
    });

    await expect(loginUser(null, { input })).rejects.toThrow('Login failed');
  });

  it('should handle toObject method errors', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Mock successful user lookup
    mockUser.findOne.mockResolvedValue(mockUserDocument as any);
    
    // Mock toObject to throw an error
    mockUserDocument.toObject.mockImplementation(() => {
      throw new Error('toObject failed');
    });

    await expect(loginUser(null, { input })).rejects.toThrow('Login failed');
  });

  it('should re-throw GraphQLErrors without wrapping', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    const originalError = new GraphQLError('Custom error', {
      extensions: { code: 'CUSTOM_ERROR' }
    });

    // Mock User.findOne to throw the GraphQLError
    mockUser.findOne.mockImplementation(() => {
      throw originalError;
    });

    await expect(loginUser(null, { input })).rejects.toThrow(originalError);
  });

  it('should handle populate chain errors', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Mock the populate chain to fail
    const mockQuery = {
      populate: jest.fn().mockReturnThis()
    };
    
    mockUser.findOne.mockReturnValue(mockQuery as any);
    mockQuery.populate.mockImplementation(() => {
      throw new Error('Database connection failed');
    });
    
    await expect(loginUser(null, { input })).rejects.toThrow('Login failed');
  });

  it('should wrap non-GraphQLErrors with Login failed message', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Mock User.findOne to throw a regular Error (not GraphQLError)
    mockUser.findOne.mockImplementation(() => {
      throw new Error('Some unexpected error');
    });
    
    await expect(loginUser(null, { input })).rejects.toThrow('Login failed');
  });
});