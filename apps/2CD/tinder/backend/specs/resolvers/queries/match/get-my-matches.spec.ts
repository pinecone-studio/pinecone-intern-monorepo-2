import Match from 'src/models/match';
import { getMyMatches } from 'src/resolvers/queries/match/get-my-matches';

jest.mock('src/models/match');

describe('getMyMatches', () => {
  const mockUserId = 'user123';

  it('should throw an error if userId is not in context', async () => {
    await expect(getMyMatches({}, {}, {})).rejects.toThrow('Unauthorized');
  });

  it('should return matches for the authenticated user', async () => {
    const mockMatches = [
      {
        _id: 'match1',
        users: [
          { _id: 'user123', name: 'Alice' },
          { _id: 'user456', name: 'Bob' },
        ],
      },
    ];

    const populateMock = jest.fn().mockReturnThis();
    const execMock = jest.fn().mockResolvedValue(mockMatches);

    (Match.find as jest.Mock).mockReturnValue({
      populate: populateMock,
      exec: execMock,
    });

    const context = { userId: mockUserId };
    const result = await getMyMatches({}, {}, context);

    expect(Match.find).toHaveBeenCalledWith({ users: mockUserId });
    expect(populateMock).toHaveBeenCalledWith('users');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockMatches);
  });
});
