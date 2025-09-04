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
    it('should create a user successfully', async () => {
      setupSuccessfulUserCreation();
      
      const result = await createUser(null, { input: validInput });
      
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'johndoe' }, 
          { email: 'john@example.com' }
        ]
      });
      expect(mockUtils.encryptHash).toHaveBeenCalledWith('password123');
      expect(mockUtils.generateOTP).toHaveBeenCalled();
      expect(mockUtils.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', '123456');
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toEqual({
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
    });

    it('should create user successfully even when verification email fails', async () => {
      setupSuccessfulUserCreation();
      mockUtils.sendVerificationEmail.mockRejectedValue(new Error('Email service down'));
      
      const result = await createUser(null, { input: validInput });
      
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send verification email:', expect.any(Error));
      expect(result).toBeDefined();
    });
  });
});