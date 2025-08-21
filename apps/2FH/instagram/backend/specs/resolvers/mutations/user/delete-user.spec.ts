import { deleteUser } from 'src/resolvers/mutations/user/delete-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';
import { GraphQLError } from 'graphql';
import { ContextUser } from 'src/types/context-user';

jest.mock('src/models/user');
jest.mock('src/utils/check-jwt', () => ({ 
  getJwtSecret: jest.fn(() => 'mock-jwt-secret') 
}));
jest.mock('src/utils/auth', () => ({
  requireAuthentication: jest.fn(() => 'user123'),
  validateUserOwnership: jest.fn()
}));

const mockUser = User as jest.Mocked<typeof User>;

beforeAll(() => {
  mockUser.findById = jest.fn();
  mockUser.findByIdAndDelete = jest.fn();
});

describe('User Mutations', () => {
  const mockContext: ContextUser = {} as ContextUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findById = jest.fn();
    mockUser.findByIdAndDelete = jest.fn();
  });

  describe('deleteUser', () => {
    const validUserId = 'user123';
    const mockUserData = {
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
    };

    it('should delete a user successfully', async () => {
      const mockToObject = jest.fn().mockReturnValue(mockUserData);
      const mockDeletedUser = {
        ...mockUserData,
        toObject: mockToObject
      };

      mockUser.findById.mockResolvedValue(mockUserData as never);
      mockUser.findByIdAndDelete.mockResolvedValue(mockDeletedUser as never);

      const result = await deleteUser(
        null, 
        { userId: validUserId }, 
        mockContext
      );

      expect(mockUser.findById).toHaveBeenCalledWith(validUserId);
      expect(mockUser.findByIdAndDelete).toHaveBeenCalledWith(validUserId);
      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
        deletedUser: mockUserData
      });
    });

    it('should throw error if user not found during verification', async () => {
      mockUser.findById.mockResolvedValue(null);

      await expect(
        deleteUser(null, { userId: validUserId }, mockContext)
      ).rejects.toThrow(
        new GraphQLError('User not found', { 
          extensions: { code: 'USER_NOT_FOUND' } 
        })
      );

      expect(mockUser.findById).toHaveBeenCalledWith(validUserId);
      expect(mockUser.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should throw error if user not found during deletion', async () => {
      mockUser.findById.mockResolvedValue(mockUserData as never);
      mockUser.findByIdAndDelete.mockResolvedValue(null);

      await expect(
        deleteUser(null, { userId: validUserId }, mockContext)
      ).rejects.toThrow(
        new GraphQLError('User not found', { 
          extensions: { code: 'USER_NOT_FOUND' } 
        })
      );

      expect(mockUser.findById).toHaveBeenCalledWith(validUserId);
      expect(mockUser.findByIdAndDelete).toHaveBeenCalledWith(validUserId);
    });

    it('should throw error with invalid user ID format', async () => {
      const invalidUserId = 'invalid-id';
      mockUser.findById.mockRejectedValue(new Error('Invalid ObjectId'));

      await expect(
        deleteUser(null, { userId: invalidUserId }, mockContext)
      ).rejects.toThrow(
        new GraphQLError('Failed to delete user', { 
          extensions: { code: 'USER_DELETION_FAILED' } 
        })
      );

      expect(mockUser.findById).toHaveBeenCalledWith(invalidUserId);
    });

    it('should throw generic error for unexpected deletion failures', async () => {
      mockUser.findById.mockResolvedValue(mockUserData as never);
      mockUser.findByIdAndDelete.mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(
        deleteUser(null, { userId: validUserId }, mockContext)
      ).rejects.toThrow(
        new GraphQLError('Failed to delete user', { 
          extensions: { code: 'USER_DELETION_FAILED' } 
        })
      );

      expect(mockUser.findById).toHaveBeenCalledWith(validUserId);
      expect(mockUser.findByIdAndDelete).toHaveBeenCalledWith(validUserId);
    });

    it('should handle database errors gracefully', async () => {
      mockUser.findById.mockRejectedValue(new Error('Database timeout'));

      await expect(
        deleteUser(null, { userId: validUserId }, mockContext)
      ).rejects.toThrow(
        new GraphQLError('Failed to delete user', { 
          extensions: { code: 'USER_DELETION_FAILED' } 
        })
      );
    });
  });
});
