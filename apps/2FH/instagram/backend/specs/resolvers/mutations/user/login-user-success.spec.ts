import { loginUser } from 'src/resolvers/mutations/user/login-user-mutation';
import { User } from 'src/models';
import { decryptHash } from 'src/utils';
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

describe('loginUser - Success Cases', () => {
  let mockUserDocument: MockUserDocument;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocument = createMockUserDocument(true);
    mockJwt.sign.mockReturnValue(mockToken as never);
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
  
  it('should allow login for user without email (phone number only)', async () => {
    const input = { identifier: 'testuser', password: 'plainPassword' };
    const userWithoutEmail: MockUserDocument = {
      ...mockUserDocument,
      email: undefined,
      phoneNumber: '+1234567890',
      toObject: jest.fn().mockReturnValue({
        _id: mockUserId,
        userName: mockUserName,
        phoneNumber: '+1234567890',
        isVerified: false
      })
    };
    
    mockUser.findOne.mockResolvedValue(userWithoutEmail as never);
    
    const result = await loginUser(null, { input });
    expect(result.token).toBe(mockToken);
    expect((result.user as { phoneNumber?: string }).phoneNumber).toBe('+1234567890');
  });
  
  it('should handle user object without expected fields', async () => {
    const input = { identifier: 'test@example.com', password: 'plainPassword' };
    const incompleteUser: Partial<MockUserDocument> = {
      _id: { toString: () => mockUserId },
      isVerified: true,
      toObject: jest.fn().mockReturnValue({
        _id: mockUserId,
        password: mockPassword,
        isVerified: true
      })
    };
    mockUser.findOne.mockResolvedValue(incompleteUser as never);
    
    const result = await loginUser(null, { input });
    expect(result.user).toEqual({ _id: mockUserId, isVerified: true });
    expect(result.user).not.toHaveProperty('password');
  });
});