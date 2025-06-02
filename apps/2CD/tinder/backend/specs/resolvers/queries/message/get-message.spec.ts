import getMessage from 'src/resolvers/queries/message/get-message';
import Message from 'src/models/message';

jest.mock('src/models/message');

describe('getMessage (by matchId)', () => {
  const mockMatchId = 'match123';
  const mockMessages = [
    { _id: 'msg1', content: 'Hi', sender: 'user1', match: mockMatchId },
    { _id: 'msg2', content: 'Hello', sender: 'user2', match: mockMatchId },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all messages for a given matchId', async () => {
    (Message.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockMessages),
    });

    const result = await getMessage(null, { matchId: mockMatchId });

    expect(result).toEqual(mockMessages);
    expect(Message.find).toHaveBeenCalledWith({ match: mockMatchId });
  });

  it('should handle errors and throw original error message if available', async () => {
    const customError = new Error('DB failure');
    (Message.find as jest.Mock).mockImplementation(() => {
      throw customError;
    });

    await expect(getMessage(null, { matchId: mockMatchId })).rejects.toThrow('DB failure');
  });

  it('should throw "Unknown error" when error.message is undefined', async () => {
    (Message.find as jest.Mock).mockImplementation(() => {
      throw {};
    });

    await expect(getMessage(null, { matchId: mockMatchId })).rejects.toThrow('Unknown error');
  });
});
