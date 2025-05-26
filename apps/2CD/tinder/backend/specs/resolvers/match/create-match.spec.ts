import { createMatch } from 'src/resolvers/match/create-match';
import Match from 'src/models/match';

// Mock the Match model methods
jest.mock('src/models/match', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('createMatch', () => {
  const user = { _id: 'user1' };
  const userId = 'user2';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(createMatch(null, { userId }, { user: undefined }))
      .rejects.toThrow('Unauthorized');

    await expect(createMatch(null, { userId }, { user: { _id: null } }))
      .rejects.toThrow('Unauthorized');
  });

  it('returns existing match if found', async () => {
    const existingMatch = { _id: 'match1', users: [user._id, userId] };

    (Match.findOne as jest.Mock).mockResolvedValue(existingMatch);

    const result = await createMatch(null, { userId }, { user });

    expect(Match.findOne).toHaveBeenCalledWith({
      users: { $all: [user._id, userId] },
    });

    expect(result).toBe(existingMatch);
  });

  it('creates and returns new match if no existing match found', async () => {
    (Match.findOne as jest.Mock).mockResolvedValue(null);

    const newMatch = { _id: 'match2', users: [user._id, userId] };
    (Match.create as jest.Mock).mockResolvedValue(newMatch);

    const result = await createMatch(null, { userId }, { user });

    expect(Match.findOne).toHaveBeenCalledWith({
      users: { $all: [user._id, userId] },
    });

    expect(Match.create).toHaveBeenCalledWith({
      users: [user._id, userId],
    });

    expect(result).toBe(newMatch);
  });
});
