import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { Comment } from 'src/models/';
import { createReplyOnComment } from 'src/resolvers/mutations';

jest.mock('src/models/', () => ({
  Comment: { findById: jest.fn(), create: jest.fn() },
}));

describe('createReplyOnComment', () => {
  const user = { id: new Types.ObjectId().toHexString() };
  const context = { user };

  it('should throw if user not authenticated', async () => {
    await expect(createReplyOnComment({}, { commentId: '123', content: 'reply' }, { user: undefined })).rejects.toThrow(GraphQLError);
  });

  it('should throw if content is empty', async () => {
    await expect(createReplyOnComment({}, { commentId: '507f1f77bcf86cd799439011', content: '' }, context)).rejects.toThrow('Content is empty');
  });

  it('should throw if invalid commentId format', async () => {
    await expect(createReplyOnComment({}, { commentId: 'bad-id', content: 'reply' }, context)).rejects.toThrow('Invalid ID format');
  });

  it('should throw if parent comment not found', async () => {
    (Comment.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(createReplyOnComment({}, { commentId: new Types.ObjectId().toHexString(), content: 'reply' }, context)).rejects.toThrow('Comment not found');
  });

  it('should create and return new reply successfully', async () => {
    const mockParentComment = { comments: [], save: jest.fn() };
    (Comment.findById as jest.Mock).mockResolvedValue(mockParentComment);

    const mockReply = { _id: new Types.ObjectId(), content: 'reply' };
    (Comment.create as jest.Mock).mockResolvedValue(mockReply);

    const result = await createReplyOnComment({}, { commentId: new Types.ObjectId().toHexString(), content: 'reply' }, context);

    expect(result).toEqual(mockReply);
    expect(mockParentComment.comments).toContain(mockReply._id);
    expect(mockParentComment.save).toHaveBeenCalled();
  });
});
