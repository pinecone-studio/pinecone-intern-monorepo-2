import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { PostModel } from 'src/models';
import { updatePostByCaption } from 'src/resolvers/mutations/post/update-by-caption';

// Mock the PostModel
jest.mock('src/models', () => ({
  PostModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockPostModel = PostModel as jest.Mocked<typeof PostModel>;

describe('updatePostBycaptoin', () => {
  const mockInput = {
    caption: 'Updated caption',
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
  };

  const mockPost = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    caption: 'Original caption',
    author: new Types.ObjectId('507f1f77bcf86cd799439012'),
    save: jest.fn(),
  };

  const mockUpdatedPost = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    caption: 'Updated caption',
    author: new Types.ObjectId('507f1f77bcf86cd799439012'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Input validation', () => {
    it('should throw error if _id is missing', async () => {
      const invalidInput = { ...mockInput, _id: '' };

      await expect(updatePostByCaption({}, invalidInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('Post _id is reqiured'));
    });

    it('should throw error if caption is missing', async () => {
      const invalidInput = { ...mockInput, caption: '' };

      await expect(updatePostByCaption({}, invalidInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('caption is missing'));
    });

    it('should throw error if userId is missing', async () => {
      const invalidInput = { ...mockInput, userId: '' };

      await expect(updatePostByCaption({}, invalidInput, { context: { userId: '' } })).rejects.toThrow(new GraphQLError('not found authinticated user'));
    });
  });

  describe('ID validation', () => {
    it('should throw error if post _id is invalid ObjectId', async () => {
      const invalidInput = { ...mockInput, _id: 'invalid-id' };

      await expect(updatePostByCaption({}, invalidInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('Invalid post ID'));
    });

    it('should throw error if userId is invalid ObjectId', async () => {
      const invalidInput = { ...mockInput, userId: 'invalid-user-id' };

      await expect(updatePostByCaption({}, invalidInput, { context: { userId: 'invalid-user-id' } })).rejects.toThrow(new GraphQLError('Invalid auth user ID'));
    });
  });

  describe('Authorization checks', () => {
    it('should throw error if post is not found', async () => {
      mockPostModel.findOne.mockResolvedValue(null);

      await expect(updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('Post is not found'));

      expect(mockPostModel.findOne).toHaveBeenCalledWith({ _id: mockInput._id });
    });

    it('should throw error if user is not the author', async () => {
      const unauthorizedPost = {
        ...mockPost,
        author: new Types.ObjectId('507f1f77bcf86cd799439013'), // Different user
      };

      mockPostModel.findOne.mockResolvedValue(unauthorizedPost);

      await expect(updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('You are not author of this post'));
    });

    it('should pass authorization check if user is the author', async () => {
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

      const result = await updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } });

      expect(result).toEqual(mockUpdatedPost);
      expect(mockPostModel.findOne).toHaveBeenCalledWith({ _id: mockInput._id });
    });
  });

  describe('Post update', () => {
    it('should successfully update post caption', async () => {
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

      const result = await updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } });

      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(mockInput._id, { caption: mockInput.caption }, { new: true });
      expect(result).toEqual(mockUpdatedPost);
    });

    it('should throw error if post update fails', async () => {
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('not found updated post'));
    });
  });

  describe('Integration', () => {
    it('should complete full update flow successfully', async () => {
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

      const result = await updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } });

      // Verify all steps were called
      expect(mockPostModel.findOne).toHaveBeenCalledWith({ _id: mockInput._id });
      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(mockInput._id, { caption: mockInput.caption }, { new: true });
      expect(result).toEqual(mockUpdatedPost);
    });

    it('should handle unexpected errors and convert them to GraphQLError', async () => {
      // Mock a successful findOne but then make findByIdAndUpdate throw an unexpected error
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockRejectedValue(new Error('Database connection failed'));

      await expect(updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('Failed to update post by caption:Database connection failed'));
    });

    it('should handle non-Error objects and convert them to GraphQLError', async () => {
      mockPostModel.findOne.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockRejectedValue('String error');

      await expect(updatePostByCaption({}, mockInput, { context: { userId: mockInput.userId } })).rejects.toThrow(new GraphQLError('Failed to update post by caption:"String error"'));
    });
  });
});
