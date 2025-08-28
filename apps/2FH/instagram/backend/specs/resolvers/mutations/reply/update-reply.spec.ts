import { updateReply } from 'src/resolvers/mutations';
import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  Reply: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateReply', () => {
  const mockContext = { userId: 'user123' };
  const validInput = { _id: 'reply1', input: { content: 'updated content' } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates a reply successfully', async () => {
    const mockReply = { id: 'reply1', author: mockContext.userId, content: 'updated content' };
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockReply);

    const result = await updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext);

    expect(Reply.findByIdAndUpdate).toHaveBeenCalledWith(validInput._id, { content: validInput.input.content }, { new: true });
    expect(result).toEqual(mockReply);
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, { userId: '' })).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, { userId: '' })).rejects.toThrow('User is not authenticated');
  });

  it('throws an error if reply is not found', async () => {
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow('Reply not found');
  });

  it('re-throws GraphQLError without modification', async () => {
    const originalError = new GraphQLError('Original GraphQL error');
    (Reply.findByIdAndUpdate as jest.Mock).mockRejectedValue(originalError);

    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow('Original GraphQL error');
  });

  it('throws a GraphQLError for unexpected Error instances', async () => {
    (Reply.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow('Failed to update replyDB connection failed');
  });

  it('throws a GraphQLError for non-Error instances', async () => {
    (Reply.findByIdAndUpdate as jest.Mock).mockRejectedValue('String error');

    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow('Failed to update replyError');
  });

  it('handles null/undefined errors', async () => {
    (Reply.findByIdAndUpdate as jest.Mock).mockRejectedValue(null);

    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(updateReply(null, { _id: validInput._id, input: validInput.input }, mockContext)).rejects.toThrow('Failed to update replyError');
  });
});
