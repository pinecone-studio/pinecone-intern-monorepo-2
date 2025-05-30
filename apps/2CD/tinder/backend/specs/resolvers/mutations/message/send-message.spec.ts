import sendMessage from 'src/resolvers/mutations/message/send-message';
import Match from 'src/models/match';
import Message from 'src/models/message';

jest.mock('src/models/match');
jest.mock('src/models/message');

describe('sendMessage resolver', () => {
  const mockMatch = {
    _id: 'match123',
    users: ['user1', 'user2'],
  };

  const mockMessage = {
    _id: 'message123',
    match: 'match123',
    sender: 'user1',
    content: 'Hello!',
    createdAt: new Date(),
  };

  const context = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message successfully', async () => {
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockResolvedValue(mockMessage);

    const args = {
      matchId: 'match123',
      senderId: 'user1',
      content: 'Hello!',
    };

    const result = await sendMessage({}, args, context);

    expect(Match.findById).toHaveBeenCalledWith('match123');
    expect(Message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        match: 'match123',
        sender: 'user1',
        content: 'Hello!',
      })
    );

    expect(result).toEqual(mockMessage);
  });

  it('should throw error if message content is empty', async () => {
    const args = {
      matchId: 'match123',
      senderId: 'user1',
      content: '   ',
    };

    await expect(sendMessage({}, args, context)).rejects.toThrow('Message content cannot be empty');
  });

  it('should throw error if match is not found', async () => {
    (Match.findById as jest.Mock).mockResolvedValue(null);

    const args = {
      matchId: 'invalidId',
      senderId: 'user1',
      content: 'Hi there!',
    };

    await expect(sendMessage({}, args, context)).rejects.toThrow('Match not found');
  });

  it('should throw error if sender is not in match', async () => {
    const badMatch = { ...mockMatch, users: ['user2', 'user3'] };
    (Match.findById as jest.Mock).mockResolvedValue(badMatch);

    const args = {
      matchId: 'match123',
      senderId: 'user1',
      content: 'Hi there!',
    };

    await expect(sendMessage({}, args, context)).rejects.toThrow('You are not part of this match');
  });

  it('should throw a generic error if Message.create fails', async () => {
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockRejectedValue(new Error('DB write error'));

    const args = {
      matchId: 'match123',
      senderId: 'user1',
      content: 'Hello!',
    };

    await expect(sendMessage({}, args, context)).rejects.toThrow('DB write error');
  });
  it('should throw a generic error if unknown error is thrown', async () => {
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockRejectedValue('something weird happened'); // Not an Error instance

    const args = {
      matchId: 'match123',
      senderId: 'user1',
      content: 'Hi there!',
    };

    await expect(sendMessage({}, args, {})).rejects.toThrow('Failed to send message');
  });

});
