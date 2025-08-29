//craete-user.spec.ts
import { createUser } from 'src/resolvers/mutations/user/create-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import { GraphQLError } from 'graphql';
import * as hashUtils from 'src/utils/hash';

jest.mock('src/models/user');
jest.mock('src/utils/hash');
jest.mock('src/utils/check-jwt', () => ({ getJwtSecret: jest.fn(() => 'mock-jwt-secret') }));

const mockUser = User as jest.Mocked<typeof User>;
const mockEncryptHash = hashUtils.encryptHash as jest.MockedFunction<typeof hashUtils.encryptHash>;

beforeAll(() => { mockUser.findOne = jest.fn(); });

describe('User Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findOne = jest.fn();
  });

  describe('createUser', () => {
    const validInput = {
      fullName: 'John Doe', userName: 'johndoe', email: 'john@example.com',
      password: 'password123', gender: Gender.Male
    };

    it('should create a user successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      const mockToObject = jest.fn().mockReturnValue({
        _id: 'user123', fullName: 'John Doe', userName: 'johndoe', email: 'john@example.com',
        gender: Gender.Male, isPrivate: false, isVerified: false,
        posts: [], stories: [], followers: [], followings: []
      });

      mockUser.findOne.mockResolvedValue(null);
      mockEncryptHash.mockReturnValue('hashedPassword123');
      mockUser.prototype.save = mockSave;
      mockUser.prototype.toObject = mockToObject;

      const result = await createUser(null, { input: validInput });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [{ userName: 'johndoe' }, { email: 'john@example.com' }]
      });
      expect(mockEncryptHash).toHaveBeenCalledWith('password123');
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({
        _id: 'user123', fullName: 'John Doe', userName: 'johndoe', email: 'john@example.com',
        gender: Gender.Male, isPrivate: false, isVerified: false,
        posts: [], stories: [], followers: [], followings: []
      });
    });

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

    it('should throw error if neither email nor phone provided', async () => {
      const invalidInput = { ...validInput, email: undefined, phoneNumber: undefined };
      mockUser.findOne.mockResolvedValue(null);

      await expect(createUser(null, { input: invalidInput })).rejects.toThrow(
        new GraphQLError('Either email or phone number is required', { extensions: { code: 'CONTACT_REQUIRED' } })
      );
    });

    it('should create user with phone number only', async () => {
      const inputWithPhone = {
        fullName: 'Jane Doe', userName: 'janedoe', phoneNumber: '+1234567890',
        password: 'password123', gender: Gender.Male
      };

      const mockSave = jest.fn().mockResolvedValue(undefined);
      const mockToObject = jest.fn().mockReturnValue({
        _id: 'user124', fullName: 'Jane Doe', userName: 'janedoe', phoneNumber: '+1234567890',
        gender: Gender.Male, isPrivate: false, isVerified: false,
        posts: [], stories: [], followers: [], followings: []
      });

      mockUser.findOne.mockResolvedValue(null);
      mockEncryptHash.mockReturnValue('hashedPassword123');
      mockUser.prototype.save = mockSave;
      mockUser.prototype.toObject = mockToObject;

      const result = await createUser(null, { input: inputWithPhone });

      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [{ userName: 'janedoe' }, { phoneNumber: '+1234567890' }]
      });
      expect(result.phoneNumber).toBe('+1234567890');
    });

    it('should throw error if phone number already exists', async () => {
      const inputWithPhone = { ...validInput, phoneNumber: '+1234567890' };
      const existingUser = { userName: 'differentuser', phoneNumber: '+1234567890' };
      mockUser.findOne.mockResolvedValue(existingUser as never);

      await expect(createUser(null, { input: inputWithPhone })).rejects.toThrow(
        new GraphQLError('Phone number already exists', { extensions: { code: 'PHONE_EXISTS' } })
      );
    });

    it('should throw generic error for unexpected failures', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockEncryptHash.mockReturnValue('hashedPassword123');
      const mockSave = jest.fn().mockRejectedValueOnce(new Error('Database error'));
      mockUser.prototype.save = mockSave;

      await expect(createUser(null, { input: validInput })).rejects.toThrow(
        new GraphQLError('Failed to create user', { extensions: { code: 'USER_CREATION_FAILED' } })
      );
    });
  });
});