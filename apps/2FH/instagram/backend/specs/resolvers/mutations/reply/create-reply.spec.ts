import { createReply } from 'src/resolvers/mutations/reply/create-reply';
import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  Reply: {
    create: jest.fn(),
  },
}));

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('createReply', () => {
  const mockContext = { userId: 'user123' };
  const validInput = { content: 'this is a reply' };

  afterEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('creates a reply successfully', async () => {
    const mockReply = { id: 'reply1', author: mockContext.userId, content: validInput.content };

    (Reply.create as jest.Mock).mockResolvedValue(mockReply);

    const result = await createReply(null, { input: validInput }, mockContext);

    expect(Reply.create).toHaveBeenCalledWith({
      author: mockContext.userId,
      content: validInput.content,
    });

    expect(result).toEqual(mockReply);
    expect(mockConsoleLog).toHaveBeenCalledWith(mockReply);
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(createReply(null, { input: validInput }, { userId: '' })).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: validInput }, { userId: '' })).rejects.toThrow('User is not authenticated');
  });

  it('throws an error if content is missing', async () => {
    await expect(createReply(null, { input: { content: '' } }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: { content: '' } }, mockContext)).rejects.toThrow('Content is required');
  });

  it('throws an error if content is only whitespace', async () => {
    await expect(createReply(null, { input: { content: '   ' } }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: { content: '   ' } }, mockContext)).rejects.toThrow('Content is required');
  });

  it('re-throws GraphQLError without modification', async () => {
    const originalError = new GraphQLError('Original GraphQL error');
    (Reply.create as jest.Mock).mockRejectedValue(originalError);

    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow('Original GraphQL error');
  });

  it('throws a GraphQLError for unexpected Error instances', async () => {
    (Reply.create as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow('Failed to create replyDB connection failed');
  });

  it('throws a GraphQLError for non-Error instances', async () => {
    (Reply.create as jest.Mock).mockRejectedValue('String error');

    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow('Failed to create replyError');
  });

  it('handles null/undefined errors', async () => {
    (Reply.create as jest.Mock).mockRejectedValue(null);

    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow(GraphQLError);
    await expect(createReply(null, { input: validInput }, mockContext)).rejects.toThrow('Failed to create replyError');
  });
});
