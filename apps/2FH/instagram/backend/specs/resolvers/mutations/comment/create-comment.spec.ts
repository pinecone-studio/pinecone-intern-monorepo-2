import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { PostModel, Comment } from 'src/models/';
import { createCommentOnPost } from 'src/resolvers/mutations';

jest.mock('src/models/', () => ({
  PostModel: { findById: jest.fn() },
  Comment: { create: jest.fn() },
}));

describe('createCommentOnPost', () => {
  const user = { id: new Types.ObjectId().toHexString() };
  const context = { user };

  it('should throw if user not authenticated', async () => {
    await expect(createCommentOnPost({}, { postId: '123', content: 'test' }, { user: undefined })).rejects.toThrow(GraphQLError);
  });

  it('should throw if content is empty', async () => {
    await expect(createCommentOnPost({}, { postId: '507f1f77bcf86cd799439011', content: '' }, context)).rejects.toThrow('Content is empty');
  });

  it('should throw if invalid postId format', async () => {
    await expect(createCommentOnPost({}, { postId: 'not-an-id', content: 'hello' }, context)).rejects.toThrow('Invalid ID format');
  });

  it('should throw if post not found', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(createCommentOnPost({}, { postId: new Types.ObjectId().toHexString(), content: 'test' }, context)).rejects.toThrow('Post not found');
  });

  it('should create and return new comment successfully', async () => {
    const mockPost = { comments: [], save: jest.fn() };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
    const mockComment = { _id: new Types.ObjectId(), content: 'test' };
    (Comment.create as jest.Mock).mockResolvedValue(mockComment);

    const result = await createCommentOnPost({}, { postId: new Types.ObjectId().toHexString(), content: 'test' }, context);

    expect(result).toEqual(mockComment);
    expect(mockPost.comments).toContain(mockComment._id);
    expect(mockPost.save).toHaveBeenCalled();
  });
});
