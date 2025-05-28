import Like from 'src/models/like';
import { getLikesFromUser } from 'src/resolvers/queries/like/get-likes-from-user';

jest.mock('src/models/like');

describe('getLikesFromUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of likes from a user, populated and sorted', async () => {
    const mockUserId = 'user123';
    const mockLikes = [
      {
        from: { _id: 'user123', username: 'Alice' },
        to: { _id: 'user456', username: 'Bob' },
        createdAt: new Date('2023-01-01'),
      },
    ];

    const sortMock = jest.fn().mockResolvedValue(mockLikes);
    const populateToMock = jest.fn().mockReturnValue({ sort: sortMock });
    const populateFromMock = jest.fn().mockReturnValue({ populate: populateToMock });
    (Like.find as jest.Mock).mockReturnValue({ populate: populateFromMock });

    const result = await getLikesFromUser({}, { userId: mockUserId });

    expect(Like.find).toHaveBeenCalledWith({ from: mockUserId });
    expect(populateFromMock).toHaveBeenCalledWith('from');
    expect(populateToMock).toHaveBeenCalledWith('to');
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockLikes);
  });
});
