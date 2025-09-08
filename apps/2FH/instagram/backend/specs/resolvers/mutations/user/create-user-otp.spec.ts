import { createUser } from 'src/resolvers/mutations/user/create-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import * as utils from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models/user');
jest.mock('src/utils');
jest.mock('src/utils/check-jwt', () => ({ getJwtSecret: jest.fn(() => 'mock-jwt-secret') }));

const mockUtils = utils as jest.Mocked<typeof utils>;

describe('User Mutations - Create User OTP Cases', () => {
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
    
    return { 
      mockSave: mockUserInstance.save, 
      mockToObject: mockUserInstance.toObject 
    };
  };

  describe('createUser - OTP Management', () => {
    it('should store OTP with expiration and cleanup', async () => {
      setupSuccessfulUserCreation();
      
      // Use Jest's timer mocking instead of manual mocking
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      await createUser(null, { input: validInput });
      
      const otpKey = 'verification_john@example.com';
      expect(otpStorage.has(otpKey)).toBe(true);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 600000);
      
      // Fast-forward time to trigger cleanup
      jest.advanceTimersByTime(600000);
      
      expect(otpStorage.has(otpKey)).toBe(false);
      
      // Restore timers
      jest.useRealTimers();
      setTimeoutSpy.mockRestore();
    });

    it('should not cleanup OTP if expiration time changed', async () => {
      setupSuccessfulUserCreation();
      
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      await createUser(null, { input: validInput });
      
      const otpKey = 'verification_john@example.com';
      const currentOtp = otpStorage.get(otpKey);
      
      if (currentOtp) {
        // Change the expiration time
        otpStorage.set(otpKey, { otp: currentOtp.otp, expiresAt: Date.now() + 1000000 });
      }
      
      // Fast-forward time to trigger cleanup
      jest.advanceTimersByTime(600000);
      
      // Should not cleanup because expiration time was modified
      expect(otpStorage.has(otpKey)).toBe(true);
      
      // Restore timers
      jest.useRealTimers();
      setTimeoutSpy.mockRestore();
    });
  });
});