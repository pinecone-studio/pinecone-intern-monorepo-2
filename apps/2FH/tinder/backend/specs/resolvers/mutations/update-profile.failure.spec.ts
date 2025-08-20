import { GraphQLError } from 'graphql';
import { Profile, User } from 'src/models';
import { updateProfile } from 'src/resolvers/mutations';
import { UpdateProfileInput } from 'src/generated';

jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

describe('updateProfile mutation - Failure Cases', () => {
  const mockContext = { user: { id: '507f1f77bcf86cd799439011' } };
  const mockInfo = { fieldName: 'updateProfile' } as any;
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockProfileInput: UpdateProfileInput = {
    userId: mockUserId,
    name: 'John Doe',
    gender: 'male' as any,
    bio: 'Тогооч',
    interests: ['Спорт', 'Онцгой'],
    profession: 'Программист',
    work: 'Fullstack Developer',
    images: ['https://example.com/image1.jpg'],
    dateOfBirth: '1990-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError when user does not exist', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('User with this userId does not exist'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).not.toHaveBeenCalled();
    expect(Profile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError when profile does not exist', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Profile not found'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError when update fails', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012', userId: mockUserId });
    (Profile.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Failed to update profile'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError for invalid userId', async () => {
    const invalidInput: UpdateProfileInput = {
      ...mockProfileInput,
      userId: 'invalid-id',
    };
    const invalidIdError = new Error('Invalid ObjectId');
    (User.findById as jest.Mock).mockRejectedValueOnce(invalidIdError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: invalidInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Unknown error occurred'));

    expect(User.findById).toHaveBeenCalledWith(invalidInput.userId);
    expect(Profile.findOne).not.toHaveBeenCalled();
    expect(Profile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update profile:', invalidIdError);
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError for database error during update', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012', userId: mockUserId });
    const dbError = new Error('Database error');
    (Profile.findOneAndUpdate as jest.Mock).mockRejectedValueOnce(dbError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Unknown error occurred'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update profile:', dbError);
    consoleSpy.mockRestore();
  });

  it('should throw GraphQLError for non-Error type unknown error', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012', userId: mockUserId });
    const nonError = 'Unknown error';
    (Profile.findOneAndUpdate as jest.Mock).mockRejectedValueOnce(nonError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Unknown error occurred'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update profile:', nonError);
    consoleSpy.mockRestore();
  });

  it('should rethrow GraphQLError if thrown by validateUserExists', async () => {
    const graphQLError = new GraphQLError('Custom error');
    (User.findById as jest.Mock).mockRejectedValueOnce(graphQLError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateProfile!({}, { input: mockProfileInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Custom error'));

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).not.toHaveBeenCalled();
    expect(Profile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled(); // Засвар: console.error дуудагдахгүй
    consoleSpy.mockRestore();
  });
});
