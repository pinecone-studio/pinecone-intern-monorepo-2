import { deleteReply } from 'src/resolvers/mutations';
import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  Reply: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe('deleteReply', () => {
  const mockContext = { userId: 'user123' };
  const validInput = { _id: 'reply1' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deletes a reply successfully', async () => {
    const mockReply = { id: 'reply1', author: mockContext.userId, content: 'this is a reply' };
    (Reply.findByIdAndDelete as jest.Mock).mockResolvedValue(mockReply);

    const result = await deleteReply(null, { _id: validInput._id }, mockContext);

    expect(Reply.findByIdAndDelete).toHaveBeenCalledWith(validInput._id);
    expect(result).toBe(true);
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(deleteReply(null, { _id: validInput._id }, { userId: '' })).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, { userId: '' })).rejects.toThrow('User is not authenticated');
  });

  it('throws an error if reply is not found', async () => {
    (Reply.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow('Reply not found');
  });

  it('re-throws GraphQLError without modification', async () => {
    const originalError = new GraphQLError('Original GraphQL error');
    (Reply.findByIdAndDelete as jest.Mock).mockRejectedValue(originalError);

    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow('Original GraphQL error');
  });

  it('throws a GraphQLError for unexpected Error instances', async () => {
    (Reply.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow('Failed to delete replyDB connection failed');
  });

  it('throws a GraphQLError for non-Error instances', async () => {
    (Reply.findByIdAndDelete as jest.Mock).mockRejectedValue('String error');

    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow('Failed to delete replyError');
  });

  it('handles null/undefined errors', async () => {
    (Reply.findByIdAndDelete as jest.Mock).mockRejectedValue(null);

    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(deleteReply(null, { _id: validInput._id }, mockContext)).rejects.toThrow('Failed to delete replyError');
  });
});
