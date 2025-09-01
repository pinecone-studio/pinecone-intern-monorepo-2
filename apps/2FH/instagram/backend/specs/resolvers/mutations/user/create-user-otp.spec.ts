import { createUser } from 'src/resolvers/mutations/user/create-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import * as utils from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models/user');
jest.mock('src/utils');
jest.mock('src/utils/check-jwt', () => ({ getJwtSecret: jest.fn(() => 'mock-jwt-secret') }));

const mockUser = User as jest.Mocked<typeof User>;
const mockUtils = utils as jest.Mocked<typeof utils>;

beforeAll(() => { 
  mockUser.findOne = jest.fn(); 
});

describe('User Mutations - Create User OTP Cases', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findOne = jest.fn();
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
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockToObject = jest.fn().mockReturnValue({
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
    });

    mockUser.findOne.mockResolvedValue(null);
    mockUtils.encryptHash.mockReturnValue('hashedPassword123');
    mockUser.prototype.save = mockSave;
    mockUser.prototype.toObject = mockToObject;
    mockUtils.generateOTP.mockReturnValue('123456');
    mockUtils.sendVerificationEmail.mockResolvedValue(undefined);

    return { mockSave, mockToObject };
  };

  describe('createUser - OTP Management', () => {
    it('should store OTP with expiration and cleanup', async () => {
      setupSuccessfulUserCreation();
      
      const mockSetTimeout = jest.fn();
      jest.spyOn(global, 'setTimeout').mockImplementation(mockSetTimeout);
      
      await createUser(null, { input: validInput });
      
      const otpKey = 'verification_john@example.com';
      expect(otpStorage.has(otpKey)).toBe(true);
      
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 600000);
      
      const cleanupFn = mockSetTimeout.mock.calls[0][0];
      cleanupFn();
      
      expect(otpStorage.has(otpKey)).toBe(false);
      
      jest.restoreAllMocks();
    });

    it('should not cleanup OTP if expiration time changed', async () => {
      setupSuccessfulUserCreation();
      
      const mockSetTimeout = jest.fn();
      jest.spyOn(global, 'setTimeout').mockImplementation(mockSetTimeout);
      
      await createUser(null, { input: validInput });
      
      const otpKey = 'verification_john@example.com';
      
      const currentOtp = otpStorage.get(otpKey);
      if (currentOtp) {
        otpStorage.set(otpKey, { otp: currentOtp.otp, expiresAt: Date.now() + 1000000 });
      }
      
      const cleanupFn = mockSetTimeout.mock.calls[0][0];
      cleanupFn();
      
      expect(otpStorage.has(otpKey)).toBe(true);
      
      jest.restoreAllMocks();
    });
  });
});