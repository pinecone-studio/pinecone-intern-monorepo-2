import Match from 'src/models/match';
import { unMatched } from 'src/resolvers/mutations/unMatch/un-match';

 
jest.mock('src/models/match');
 
describe('unMatched', () => {
  const _id = '64b1fbd34e0f03012b345678';
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should successfully delete a match', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValueOnce({ _id: _id });
 
    const result = await unMatched(_id);
 
    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ _id: _id });
    expect(result).toEqual({
      success: true,
      message: '1 match unmatched successfully',
    });
  });
 
  it('should throw error if no match found', async () => {
    (Match.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);
 
    const result = await unMatched(_id);
 
    expect(Match.findOneAndDelete).toHaveBeenCalledWith({ _id: _id });
    expect(result).toEqual({
      success: false,
    });
  });
 
  it('should catch and handle unexpected errors', async () => {
    (Match.findOneAndDelete as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
 
    const result = await unMatched(_id);
 
    expect(result).toEqual({
      success: false,
    });
  });
});