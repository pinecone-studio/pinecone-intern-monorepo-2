import { createUser } from 'src/resolvers/mutations/user/create-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import * as utils from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models/user');
jest.mock('src/utils');
jest.mock('src/utils/check-jwt', () => ({ getJwtSecret: jest.fn(() => 'mock-jwt-secret') }));

// Type the mocked User properly
const mockUtils = utils as jest.Mocked<typeof utils>;

describe('User Mutations - Create User Basic Cases', () => {
  let consoleSpy: jest.SpyInstance;
  let mockUserInstance: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock user instance with all required methods
    mockUserInstance = {
      save: jest.fn().mockResolvedValue(undefined),
      toObject: jest.fn().mockReturnValue({
        _id: 'user123',
        fullName: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        gender: Gender.Male,
        isPrivate: false,
        isVerified: false,
        posts: [],
        stories: [],
        followers: [],
        followings: []
      }),
      _id: 'user123'
    };
    
    // Mock the User constructor
    (User as any).mockImplementation(() => mockUserInstance);
    
    // Mock static methods
    (User.findOne as jest.Mock) = jest.fn();
    (User.findById as jest.Mock) = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis().mockReturnValue({
        populate: jest.fn().mockReturnThis().mockReturnValue({
          populate: jest.fn().mockReturnThis().mockReturnValue({
            populate: jest.fn().mockResolvedValue({
              toObject: () => ({
                _id: 'user123',
                fullName: 'John Doe',
                userName: 'johndoe',
                email: 'john@example.com',
                gender: Gender.Male,
                isPrivate: false,
                isVerified: false,
                posts: [],
                stories: [],
                followers: [],
                followings: []
              })
            })
          })
        })
      })
    });
    
    otpStorage.clear();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const validInput = {
    fullName: 'John Doe', 
    userName: 'johndoe', 
    email: 'john@example.com',
    password: 'password123', 
    gender: Gender.Male
  };

  const setupSuccessfulUserCreation = () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    mockUtils.encryptHash.mockReturnValue('hashedPassword123');
    mockUtils.generateOTP.mockReturnValue('123456');
    mockUtils.sendVerificationEmail.mockResolvedValue(undefined);
  };

  describe('createUser - Basic Success Cases', () => {
    it('should handle OTP generation failure gracefully', async () => {
      setupSuccessfulUserCreation();
      mockUtils.generateOTP.mockImplementation(() => { 
        throw new Error('OTP generation failed'); 
      });
      
      const result = await createUser(null, { input: validInput });
      
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send verification email:', expect.any(Error));
      expect(result).toBeDefined();
    });

    it('should cover OTP storage cleanup timeout branch', async () => {
      setupSuccessfulUserCreation();
      
      // Use Jest's timer mocking to test the setTimeout callback
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      // Create a user with email to trigger OTP storage
      const result = await createUser(null, { input: validInput });
      
      expect(result).toBeDefined();
      expect(mockUtils.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', '123456');
      
      // Verify OTP was stored
      const otpKey = 'verification_john@example.com';
      expect(otpStorage.has(otpKey)).toBe(true);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 600000);
      
      // Run only pending timers to trigger the setTimeout callback
      // This will execute the cleanup logic: if (current && current.expiresAt === expiresAt)
      jest.runOnlyPendingTimers();
      
      // Verify OTP was cleaned up by the setTimeout callback
      expect(otpStorage.has(otpKey)).toBe(false);
      
      // Restore timers
      jest.useRealTimers();
      setTimeoutSpy.mockRestore();
    });
  });
});