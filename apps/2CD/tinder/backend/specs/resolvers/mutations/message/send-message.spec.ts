import sendMessage from 'src/resolvers/mutations/message/send-message';
import Match from 'src/models/match';
import Message from 'src/models/message';
import User from 'src/models/user';

jest.mock('src/models/match');
jest.mock('src/models/message');
jest.mock('src/models/user');

describe('sendMessage resolver', () => {
  const mockUser = {
    _id: 'user1',
    clerkId: 'clerk_123',
  };

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockResolvedValue(mockMessage);

    const result = await sendMessage(
      {},
      { matchId: 'match123', content: 'Hello!' },
      { clerkId: 'clerk_123' }
    );

    expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'clerk_123' });
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

  it('should throw error if clerkId is missing', async () => {
    await expect(
      sendMessage({}, { matchId: 'match123', content: 'Hello!' }, {})
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw error if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      sendMessage({}, { matchId: 'match123', content: 'Hello!' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('User not found');
  });

  it('should throw error if message content is empty', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      sendMessage({}, { matchId: 'match123', content: '   ' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('Message content cannot be empty');
  });

  it('should throw error if match is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Match.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      sendMessage({}, { matchId: 'invalidId', content: 'Hi there!' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('Match not found');
  });

  it('should throw error if user is not in match', async () => {
    const badMatch = { ...mockMatch, users: ['user2', 'user3'] };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Match.findById as jest.Mock).mockResolvedValue(badMatch);

    await expect(
      sendMessage({}, { matchId: 'match123', content: 'Hi there!' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('You are not part of this match');
  });

  it('should handle database errors gracefully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockRejectedValue(new Error('DB write error'));

    await expect(
      sendMessage({}, { matchId: 'match123', content: 'Hello!' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('DB write error');
  });

  it('should handle unknown errors gracefully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Match.findById as jest.Mock).mockResolvedValue(mockMatch);
    (Message.create as jest.Mock).mockRejectedValue('something weird happened');

    await expect(
      sendMessage({}, { matchId: 'match123', content: 'Hi there!' }, { clerkId: 'clerk_123' })
    ).rejects.toThrow('Failed to send message');
  });
  it('should throw error if message content is undefined', async () => {
  (User.findOne as jest.Mock).mockResolvedValue(mockUser);

  await expect(
    sendMessage({}, { matchId: 'match123', content: undefined as any }, { clerkId: 'clerk_123' })
  ).rejects.toThrow('Message content cannot be empty');
});

});
