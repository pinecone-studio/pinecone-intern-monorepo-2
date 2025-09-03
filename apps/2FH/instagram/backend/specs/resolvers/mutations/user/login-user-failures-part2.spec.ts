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
  
  it('should throw error when decryptHash throws an error', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    
    // Create a mock query object that handles the populate chain
    const mockQuery = {
      populate: jest.fn().mockReturnThis()
    };
    
    // Make the final populate call resolve to the user document
    mockQuery.populate
      .mockReturnValueOnce(mockQuery) // First populate call
      .mockReturnValueOnce(mockQuery) // Second populate call  
      .mockReturnValueOnce(mockQuery) // Third populate call
      .mockResolvedValueOnce(mockUserDocument as never); // Fourth populate call resolves
    
    // Mock User.findOne to return our mock query
    mockUser.findOne.mockReturnValue(mockQuery as any);
    
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
    
    // Create a mock query object that handles the populate chain
    const mockQuery = {
      populate: jest.fn().mockReturnThis()
    };
    
    // Make the final populate call resolve to null (user not found)
    mockQuery.populate
      .mockReturnValueOnce(mockQuery) // First populate call
      .mockReturnValueOnce(mockQuery) // Second populate call  
      .mockReturnValueOnce(mockQuery) // Third populate call
      .mockResolvedValueOnce(null); // Fourth populate call resolves to null
    
    // Mock User.findOne to return our mock query
    mockUser.findOne.mockReturnValue(mockQuery as any);
    
    await expect(loginUser(null, { input })).rejects.toThrow(
      new GraphQLError('Invalid credentials', {
        extensions: { code: 'INVALID_CREDENTIALS' }
      })
    );
  });
});