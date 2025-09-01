import { createUser } from 'src/resolvers/mutations/user/create-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import { GraphQLError } from 'graphql';
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

describe('User Mutations - Create User Error Cases', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findOne = jest.fn();
    otpStorage.clear(); // Clear OTP storage between tests
    // Create a fresh console spy for each test
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

  describe('createUser - Error Cases', () => {
    it('should throw error if username already exists', async () => {
      const existingUser = { userName: 'johndoe', email: 'different@example.com' };
      mockUser.findOne.mockResolvedValue(existingUser as never);

      await expect(createUser(null, { input: validInput })).rejects.toThrow(
        new GraphQLError('Username already exists', { extensions: { code: 'USERNAME_EXISTS' } })
      );
    });

    it('should throw error if email already exists', async () => {
      const existingUser = { userName: 'differentuser', email: 'john@example.com' };
      mockUser.findOne.mockResolvedValue(existingUser as never);

      await expect(createUser(null, { input: validInput })).rejects.toThrow(
        new GraphQLError('Email already exists', { extensions: { code: 'EMAIL_EXISTS' } })
      );
    });

    it('should throw error if phone number already exists', async () => {
      const inputWithPhone = { ...validInput, phoneNumber: '+1234567890' };
      const existingUser = { userName: 'differentuser', phoneNumber: '+1234567890' };
      mockUser.findOne.mockResolvedValue(existingUser as never);

      await expect(createUser(null, { input: inputWithPhone })).rejects.toThrow(
        new GraphQLError('Phone number already exists', { extensions: { code: 'PHONE_EXISTS' } })
      );
    });

    it('should throw error if neither email nor phone provided', async () => {
      const invalidInput = { ...validInput, email: undefined, phoneNumber: undefined };
      mockUser.findOne.mockResolvedValue(null);

      await expect(createUser(null, { input: invalidInput })).rejects.toThrow(
        new GraphQLError('Either email or phone number is required', { extensions: { code: 'CONTACT_REQUIRED' } })
      );
    });

    it('should throw generic error for unexpected failures', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockUtils.encryptHash.mockReturnValue('hashedPassword123');
      const mockSave = jest.fn().mockRejectedValueOnce(new Error('Database error'));
      mockUser.prototype.save = mockSave;

      await expect(createUser(null, { input: validInput })).rejects.toThrow(
        new GraphQLError('Failed to create user', { extensions: { code: 'USER_CREATION_FAILED' } })
      );
    });
  });
});