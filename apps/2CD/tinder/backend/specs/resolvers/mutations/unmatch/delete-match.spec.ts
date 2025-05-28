import Match from 'src/models/match';
import { unMatched } from 'src/resolvers/mutations/unmatch/delete-match';

jest.mock('src/models/match');

describe('unMatched', () => {
  const _id = 'match-id-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success if match is deleted', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValue({ _id, users: ['user1'] });

    const result = await unMatched(_id);

    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ _id });
    expect(result).toEqual({ success: true, message: '1 match unmatched successfully' });
  });

  it('should return failure if no match found', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await unMatched(_id);

    expect(result).toEqual({ success: false, message: 'No matches found for this user' });
  });

  it('should return failure if an exception occurs', async () => {
    (Match.findOneAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

    const result = await unMatched(_id);

    expect(result).toEqual({ success: false, message: 'Database error' });
  });
});
