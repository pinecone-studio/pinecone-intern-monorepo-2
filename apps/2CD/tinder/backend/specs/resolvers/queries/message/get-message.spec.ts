import getMessage from 'src/resolvers/queries/message/get-message';
import Message from 'src/models/message';

jest.mock('src/models/message');

const mockContext = {
  user: { _id: 'user123' },
};

describe('getMessage', () => {
  const mockMessageId = 'msg123';
  const mockMessage = {
    _id: mockMessageId,
    content: 'Hello',
    sender: 'user123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if user is not authenticated', async () => {
    await expect(getMessage(null, { messageId: mockMessageId }, {}))
      .rejects
      .toThrow('Unauthorized');
  });

  it('should throw if message is not found', async () => {
    (Message.findById as jest.Mock).mockResolvedValue(null);

    await expect(getMessage(null, { messageId: 'non-existent' }, mockContext))
      .rejects
      .toThrow('Message not found');
  });

  it('should return the message if found and authorized', async () => {
    (Message.findById as jest.Mock).mockResolvedValue(mockMessage);

    const result = await getMessage(null, { messageId: mockMessageId }, mockContext);
    expect(result).toEqual(mockMessage);
    expect(Message.findById).toHaveBeenCalledWith(mockMessageId);
  });

  it('should handle unexpected errors and throw the original message', async () => {
    const customError = new Error('Database error');
    (Message.findById as jest.Mock).mockImplementation(() => {
      throw customError;
    });

    await expect(getMessage(null, { messageId: mockMessageId }, mockContext))
      .rejects
      .toThrow('Database error');
  });

  it('should throw "Unknown error" when error.message is undefined', async () => {
    // Mock Message.findById to throw an error without a message
    (Message.findById as jest.Mock).mockImplementation(() => {
      throw {};
    });

    await expect(getMessage(null, { messageId: 'msg123' }, mockContext))
      .rejects
      .toThrow('Unknown error');
  });
});
