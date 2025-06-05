import Match from 'src/models/match';
import User from 'src/models/user';
import { getMyMatches } from 'src/resolvers/queries/match/get-my-matches';

jest.mock('src/models/match');
jest.mock('src/models/user');

describe('getMyMatches', () => {
  const mockClerkId = 'clerk_abc123';
  const mockUser = { _id: 'mongo_user_id', clerkId: mockClerkId };

  const mockMatches = [
    {
      _id: 'match1',
      users: [
        { _id: 'mongo_user_id', name: 'Alice' },
        { _id: 'user456', name: 'Bob' },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if clerkId is not in context', async () => {
    await expect(getMyMatches({}, {}, {})).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const context = { clerkId: mockClerkId };
    await expect(getMyMatches({}, {}, context)).rejects.toThrow('User not found');
  });

  it('should return matches for the authenticated user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const populateMock = jest.fn().mockReturnThis();
    const execMock = jest.fn().mockResolvedValue(mockMatches);

    (Match.find as jest.Mock).mockReturnValue({
      populate: populateMock,
      exec: execMock,
    });

    const context = { clerkId: mockClerkId };
    const result = await getMyMatches({}, {}, context);

    expect(User.findOne).toHaveBeenCalledWith({ clerkId: mockClerkId });
    expect(Match.find).toHaveBeenCalledWith({ users: mockUser._id });
    expect(populateMock).toHaveBeenCalledWith('users');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockMatches);
  });
});
