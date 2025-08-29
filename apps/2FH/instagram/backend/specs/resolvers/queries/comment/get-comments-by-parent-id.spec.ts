import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { Comment } from 'src/models';
import { getCommentByParentId } from 'src/resolvers/queries/comment';

jest.mock('src/models', () => ({
  Comment: {
    find: jest.fn(),
  },
}));

describe('getCommentByParentId resolver', () => {
  const mockParentId = new Types.ObjectId().toString();
  const mockComments = [
    { _id: new Types.ObjectId(), parentId: mockParentId, content: 'child 1' },
    { _id: new Types.ObjectId(), parentId: mockParentId, content: 'child 2' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return comments when valid parentId and comments exist', async () => {
    (Comment.find as jest.Mock).mockResolvedValue(mockComments);

    const result = await getCommentByParentId({}, { parentId: mockParentId });

    expect(Comment.find).toHaveBeenCalledWith({ parentId: mockParentId });
    expect(result).toEqual(mockComments);
  });

  it('should throw error when parentId is missing', async () => {
    await expect(getCommentByParentId({}, { parentId: '' })).rejects.toThrow(new GraphQLError('Id is reqiured'));
  });

  it('should throw error when parentId is invalid', async () => {
    await expect(getCommentByParentId({}, { parentId: 'invalid-id' })).rejects.toThrow(new GraphQLError('Invalid Comment ID'));
  });

  it('should throw error when comments are not found', async () => {
    (Comment.find as jest.Mock).mockResolvedValue(null);

    await expect(getCommentByParentId({}, { parentId: mockParentId })).rejects.toThrow(new GraphQLError('not found comments'));
  });
  it('should handle non-Error objects and convert them to GraphQLError', async () => {
    (Comment.find as jest.Mock).mockRejectedValue('String error');

    await expect(getCommentByParentId({}, { parentId: mockParentId })).rejects.toThrow(new GraphQLError('Failed to get comment by parent id: "String error"'));
  });

  it('should wrap non-GraphQLError into GraphQLError', async () => {
    (Comment.find as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(getCommentByParentId({}, { parentId: mockParentId })).rejects.toThrow('Failed to get comment by parent id: DB failure');
  });
});
