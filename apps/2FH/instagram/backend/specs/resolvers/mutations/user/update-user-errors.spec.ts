// update-user-errors.spec.ts
import { updateUser } from 'src/resolvers/mutations/user/update-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import { GraphQLError } from 'graphql';
import { ContextUser } from 'src/types/context-user';
jest.mock('src/models/user');
jest.mock('src/utils/auth', () => ({
  requireAuthentication: jest.fn(() => 'user123'),
  validateUserOwnership: jest.fn()
}));
const mockUser = User as jest.Mocked<typeof User>;
describe('User Mutations - updateUser Error Cases', () => {
  const userId = 'user123';
  const existingUserData = {
    _id: userId,
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
  };
  const mockContext: ContextUser = {} as ContextUser;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findOne = jest.fn();
    mockUser.findById = jest.fn();
    mockUser.findByIdAndUpdate = jest.fn();
  });
  describe('Error Cases', () => {
    it('should throw GraphQLError if user not found', async () => {
      const updateInput = { fullName: 'John Updated' };
      mockUser.findById.mockResolvedValue(null);
      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);
      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('User not found');
      expect(mockUser.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.findOne).not.toHaveBeenCalled();
      expect(mockUser.findByIdAndUpdate).not.toHaveBeenCalled();
    });
    it('should throw GraphQLError if username already exists', async () => {
      const updateInput = { userName: 'existinguser' };
      const conflictingUser = { 
        userName: 'existinguser', 
        email: 'other@example.com' 
      };
      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(conflictingUser as never);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('Username already exists');
    });
    it('should throw GraphQLError if email already exists', async () => {
      const updateInput = { email: 'existing@example.com' };
      const conflictingUser = { 
        userName: 'otheruser', 
        email: 'existing@example.com' 
      };

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(conflictingUser as never);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('Email already exists');
    });
    it('should throw GraphQLError if phone number already exists', async () => {
      const updateInput = { phoneNumber: '+9876543210' };
      const conflictingUser = { 
        userName: 'otheruser', 
        phoneNumber: '+9876543210' 
      };
      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(conflictingUser as never);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('Phone number already exists');
    });
    it('should throw GraphQLError if update operation fails', async () => {
      const updateInput = { fullName: 'Updated Name' };

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('Failed to update user');
    });
    it('should throw GraphQLError for unexpected failures', async () => {
      const updateInput = { fullName: 'Updated Name' };

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findByIdAndUpdate.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow(GraphQLError);

      await expect(
        updateUser(null, { _id: userId, input: updateInput }, mockContext)
      ).rejects.toThrow('Failed to update user');
    });
    it('should include error extensions in GraphQLError', async () => {
      const updateInput = { userName: 'existinguser' };
      const conflictingUser = { 
        userName: 'existinguser', 
        email: 'other@example.com' 
      };
      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(conflictingUser as never);
      try {
        await updateUser(
          null, 
          { _id: userId, input: updateInput }, 
          mockContext
        );
        fail('Expected GraphQLError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Username already exists');
        expect((error as GraphQLError).extensions?.code).toBe('USERNAME_EXISTS');
      }
    });
  });
});