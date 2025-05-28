import sendMessage from 'src/resolvers/mutations/message/send-message';
import Match from 'src/models/match';
import Message from 'src/models/message';

jest.mock('src/models/match');
jest.mock('src/models/message');

describe('sendMessage', () => {
  const mockUserId = 'user123';
  const mockContext = { user: { _id: mockUserId } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message successfully', async () => {
    const matchId = 'match456';
    const content = 'Hello there!';

    const mockMatch = {
      _id: matchId,
      users: [mockUserId, 'userB'],
    };

    const mockMessage = {
      _id: 'msg789',
      matchId,
      senderId: mockUserId,
      content,
      createdAt: new Date(),
    };

    // Mock implementations
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockResolvedValue(mockMessage);

    const result = await sendMessage(null, { matchId, content }, mockContext);

    expect(Match.findById).toHaveBeenCalledWith(matchId);
    expect(Message.create).toHaveBeenCalledWith({
      matchId,
      senderId: mockUserId,
      content,
      createdAt: expect.any(Date),
    });
    expect(result).toEqual(mockMessage);
  });

  it('should throw if user is not authenticated', async () => {
    await expect(
      sendMessage(null, { matchId: 'match123', content: 'Hi' }, {})
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw if match not found', async () => {
    (Match.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      sendMessage(null, { matchId: 'not-found', content: 'Hi' }, mockContext)
    ).rejects.toThrow('Match not found');
  });

  it('should throw if user is not part of the match', async () => {
    const matchId = 'match999';
    const mockMatch = {
      _id: matchId,
      users: ['anotherUser'], // does not include mockUserId
    };
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);

    await expect(
      sendMessage(null, { matchId, content: 'Hey' }, mockContext)
    ).rejects.toThrow('You are not part of this match');
  });

  it('should throw if message content is empty', async () => {
    const mockMatch = {
      _id: 'match123',
      users: [mockUserId],
    };
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);

    await expect(
      sendMessage(null, { matchId: 'match123', content: '' }, mockContext)
    ).rejects.toThrow('Message content cannot be empty');

    await expect(
      sendMessage(null, { matchId: 'match123', content: '   ' }, mockContext)
    ).rejects.toThrow('Message content cannot be empty');
  });

  it('should rethrow the actual error message when error is instance of Error', async () => {
    const mockError = new Error('Some known error');
    (Match.findById as jest.Mock).mockRejectedValue(mockError);

    await expect(
      sendMessage(null, { matchId: 'match123', content: 'Hi' }, mockContext)
    ).rejects.toThrow('Some known error');
  });

  it('should throw a generic error when error is not an Error instance', async () => {
    (Match.findById as jest.Mock).mockRejectedValue('Some error string');

    await expect(
      sendMessage(null, { matchId: 'match123', content: 'Hi' }, mockContext)
    ).rejects.toThrow('Failed to send message');
  });
});