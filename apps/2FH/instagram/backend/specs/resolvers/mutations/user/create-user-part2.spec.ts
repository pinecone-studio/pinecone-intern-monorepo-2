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
    it('should create user with phone number only', async () => {
      const inputWithPhone = {
        fullName: 'Jane Doe', 
        userName: 'janedoe', 
        phoneNumber: '+1234567890',
        password: 'password123', 
        gender: Gender.Male
      };
      // Update mock instance for this test
      mockUserInstance.toObject.mockReturnValue({
        _id: 'user124',
        fullName: 'Jane Doe',
        userName: 'janedoe',
        phoneNumber: '+1234567890',
        gender: Gender.Male,
        isPrivate: false,
        isVerified: false,
        posts: [],
        stories: [],
        followers: [],
        followings: []
      });
      mockUserInstance._id = 'user124'; 
      // Update findById mock result
      (User.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis().mockReturnValue({
          populate: jest.fn().mockReturnThis().mockReturnValue({
            populate: jest.fn().mockReturnThis().mockReturnValue({
              populate: jest.fn().mockResolvedValue({
                toObject: () => ({
                  _id: 'user124',
                  fullName: 'Jane Doe',
                  userName: 'janedoe',
                  phoneNumber: '+1234567890',
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
      (User.findOne as jest.Mock).mockResolvedValue(null);
      mockUtils.encryptHash.mockReturnValue('hashedPassword123');     
      const result = await createUser(null, { input: inputWithPhone });     
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'janedoe' }, 
          { phoneNumber: '+1234567890' }
        ]
      });
      expect(result?.phoneNumber).toBe('+1234567890');
      expect(mockUtils.generateOTP).not.toHaveBeenCalled();
      expect(mockUtils.sendVerificationEmail).not.toHaveBeenCalled();
    });
    it('should create user with both email and phone number', async () => {
      const inputWithBoth = {
        ...validInput,
        phoneNumber: '+1234567890'
      };    
      setupSuccessfulUserCreation();   
      const result = await createUser(null, { input: inputWithBoth });   
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'johndoe' }, 
          { email: 'john@example.com' },
          { phoneNumber: '+1234567890' }
        ]
      });
      expect(result).toBeDefined();
      expect(mockUtils.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', '123456');
    });
  });
});