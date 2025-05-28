
import Match from 'src/models/match';
import { getMatchById } from 'src/resolvers/queries/match/get-match-by-id';

jest.mock('src/models/match');

describe('getMatchById', () => {
  const mockMatchId = 'match123';

  it('should throw error if match is not found', async () => {

    (Match.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await expect(getMatchById({}, { _id: mockMatchId }))
      .rejects.toThrow('Match not found');

    expect(Match.findById).toHaveBeenCalledWith(mockMatchId);
  });

  it('should return the match if found', async () => {
    const mockMatch = {
      _id: mockMatchId,
      users: [{ _id: 'user1', name: 'Alice' }, { _id: 'user2', name: 'Bob' }],
    };

    const populateMock = jest.fn().mockResolvedValue(mockMatch);

    (Match.findById as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const result = await getMatchById({}, { _id: mockMatchId });

    expect(Match.findById).toHaveBeenCalledWith(mockMatchId);
    expect(populateMock).toHaveBeenCalledWith('users');
    expect(result).toEqual(mockMatch);
  });
});
