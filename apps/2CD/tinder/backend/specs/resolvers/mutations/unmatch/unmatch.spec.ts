import Match from 'src/models/match';
import { unMatched } from 'src/resolvers/mutations/unmatch/umatch';


jest.mock('src/models/match');

describe('unMatched', () => {
  const userId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success if match is deleted', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: 'match-id', users: [userId] });

    const result = await unMatched(userId);

    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ users: userId });
    expect(result).toEqual({ success: true, message: '1 match unmatched successfully' });
  });

  it('should return undefined if no match found', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await unMatched(userId);

    expect(result).toBeUndefined();
  });

  it('should return undefined if an exception occurs', async () => {
    (Match.findOneAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

    const result = await unMatched(userId);

    expect(result).toBeUndefined();
  });
});
