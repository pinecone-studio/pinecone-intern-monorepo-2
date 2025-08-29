import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { getCommentById } from 'src/resolvers/queries/comment/get-comment-by-id';
import { Comment } from 'src/models';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
  },
}));

describe('getCommentById resolver', () => {
  const mockId = new Types.ObjectId().toString();
  const mockComment = { _id: mockId, content: 'test comment' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return comment when valid id and comment exists', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    const result = await getCommentById({}, { _id: mockId });

    expect(Comment.findById).toHaveBeenCalledWith(mockId);
    expect(result).toEqual(mockComment);
  });

  it('should throw error when id is missing', async () => {
    await expect(getCommentById({}, { _id: '' })).rejects.toThrow(new GraphQLError('Id is reqiured'));
  });

  it('should throw error when id is invalid', async () => {
    await expect(getCommentById({}, { _id: 'invalid-id' })).rejects.toThrow(new GraphQLError('Invalid Comment ID'));
  });

  it('should throw error when comment is not found', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);

    await expect(getCommentById({}, { _id: mockId })).rejects.toThrow(new GraphQLError('not found comment'));
  });

  it('should wrap unexpected errors into GraphQLError', async () => {
    (Comment.findById as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(getCommentById({}, { _id: mockId })).rejects.toThrow('Failed to get comment by id: DB failure');
  });

  it('should handle non-Error objects and convert them to GraphQLError', async () => {
    (Comment.findById as jest.Mock).mockRejectedValue('String error');

    await expect(getCommentById({}, { _id: mockId })).rejects.toThrow(new GraphQLError('Failed to get comment by id: "String error"'));
  });
});
