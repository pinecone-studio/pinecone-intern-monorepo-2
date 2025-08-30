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
describe('User Mutations - Create User Basic Cases', () => {
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
  describe('createUser - Basic Success Cases', () => {
    it('should create a user successfully', async () => {
      setupSuccessfulUserCreation();
      const result = await createUser(null, { input: validInput });
      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'johndoe' }, 
          { email: 'john@example.com' }
        ]
      });
      expect(mockUtils.encryptHash).toHaveBeenCalledWith('password123');
      expect(mockUtils.generateOTP).toHaveBeenCalled();
      expect(mockUtils.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', '123456');
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
      const { mockSave } = setupSuccessfulUserCreation();
      mockUtils.sendVerificationEmail.mockRejectedValue(new Error('Email service down'));
      const result = await createUser(null, { input: validInput });
      expect(mockSave).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send verification email:', expect.any(Error));
      expect(result).toBeDefined();
    });
    it('should create user with phone number only', async () => {
      const inputWithPhone = {
        fullName: 'Jane Doe', 
        userName: 'janedoe', 
        phoneNumber: '+1234567890',
        password: 'password123', 
        gender: Gender.Male
      };
      const mockSave = jest.fn().mockResolvedValue(undefined);
      const mockToObject = jest.fn().mockReturnValue({
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
      mockUser.findOne.mockResolvedValue(null);
      mockUtils.encryptHash.mockReturnValue('hashedPassword123');
      mockUser.prototype.save = mockSave;
      mockUser.prototype.toObject = mockToObject;
      const result = await createUser(null, { input: inputWithPhone });
      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'janedoe' }, 
          { phoneNumber: '+1234567890' }
        ]
      });
      expect(result.phoneNumber).toBe('+1234567890');
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
      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [
          { userName: 'johndoe' }, 
          { email: 'john@example.com' },
          { phoneNumber: '+1234567890' }
        ]
      });
      expect(result).toBeDefined();
      expect(mockUtils.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', '123456');
    });
    it('should handle OTP generation failure gracefully', async () => {
      const { mockSave } = setupSuccessfulUserCreation();
      mockUtils.generateOTP.mockImplementation(() => { 
        throw new Error('OTP generation failed'); 
      });
      const result = await createUser(null, { input: validInput });
      expect(mockSave).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send verification email:', expect.any(Error));
      expect(result).toBeDefined();
    });
  });
});