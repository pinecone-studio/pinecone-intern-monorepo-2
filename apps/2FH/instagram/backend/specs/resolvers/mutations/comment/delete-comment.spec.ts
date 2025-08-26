import { GraphQLError } from 'graphql';
import { Comment } from 'src/models';
import { deleteComment } from 'src/resolvers/mutations/comment/delete-comment';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('deleteComment resolver', () => {
  const mockCommentId = '123abc';
  const mockUserId = 'user123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError if Id is empty', async () => {
    await expect(deleteComment({}, '', mockUserId)).rejects.toThrow('Id is not found');
  });

  it('should throw GraphQLError if comment does not exist', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);

    await expect(deleteComment({}, mockCommentId, mockUserId)).rejects.toThrow('comment not found');

    expect(Comment.findById).toHaveBeenCalledWith(mockCommentId);
  });

  it('should throw GraphQLError "not found deleted comment" if findByIdAndDelete returns null', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue({ _id: mockCommentId, author: { _id: mockUserId } });

    (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deleteComment({}, mockCommentId, mockUserId)).rejects.toThrowError(new GraphQLError('not found deleted comment'));
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(mockCommentId);
  });
  it('should throw GraphQLError if user is not the author', async () => {
    const mockComment = { _id: mockCommentId, author: { _id: 'someoneElse' } };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    await expect(deleteComment({}, mockCommentId, mockUserId)).rejects.toThrow('You are not the author of this comment');
  });

  it('should return deleted comment successfully', async () => {
    const mockComment = { _id: mockCommentId, author: mockUserId, content: 'test' };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
    (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(mockComment);

    const result = await deleteComment({}, mockCommentId);

    expect(result).toEqual(mockComment);
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(mockCommentId );
  });

  it('should catch unknown errors (Error)', async () => {
    (Comment.findById as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(deleteComment({}, mockCommentId, mockUserId)).rejects.toThrow('Failed to delete comment:DB error');
  });

  it('should catch unknown errors (string)', async () => {
    (Comment.findById as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });

    await expect(deleteComment({}, mockCommentId, mockUserId)).rejects.toThrow('Failed to delete comment:"some string"');
  });
});
