
import Match from 'src/models/match';
import { unMatched } from 'src/resolvers/mutations/unMatch/deleted-match';

jest.mock('src/models/match');

describe('unMatched', () => {
  const mockId = '64b1fbd34e0f03012b345678';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a match', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValueOnce({ _id: mockId });

    const result = await unMatched(mockId);

    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
    expect(result).toEqual({
      success: true,
      message: '1 match unmatched successfully',
    });
  });

  it('should throw error if no match found', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

    const result = await unMatched(mockId);

    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
    expect(result).toEqual({
      success: false,
    });
  });

  it('should catch and handle unexpected errors', async () => {
    (Match.findOneAndDelete as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const result = await unMatched(mockId);

    expect(result).toEqual({
      success: false,
    });
  });
});
