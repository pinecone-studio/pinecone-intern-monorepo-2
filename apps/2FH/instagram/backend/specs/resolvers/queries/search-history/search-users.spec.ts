import { searchUsers } from 'src/resolvers/queries';
import { User } from 'src/models';

jest.mock('src/models', () => ({
  User: {
    find: jest.fn()
  }
}));

describe('searchUsers', () => {
  const mockContext = { userId: 'currentUserId' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(
      searchUsers({}, { keyword: 'test' }, { userId: '' })
    ).rejects.toThrow('Authentication required');
  });

  it('returns empty array if keyword is empty', async () => {
    const result = await searchUsers({}, { keyword: '   ' }, mockContext);
    expect(result).toEqual([]);
    expect(User.find).not.toHaveBeenCalled();
  });

  it('searches users by trimmed keyword', async () => {
    const mockUsers = [
      { _id: '1', fullName: 'Alice', userName: 'alice123', profileImage: 'img1', isVerified: true },
      { _id: '2', fullName: 'Bob', userName: 'bobby', profileImage: 'img2', isVerified: false }
    ];

    const queryChain = {
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockUsers),
    };

    (User.find as jest.Mock).mockReturnValue(queryChain);

    const result = await searchUsers({}, { keyword: '  alice ' }, mockContext);

    expect(User.find).toHaveBeenCalledWith({
      $and: [
        {
          $or: [
            { userName: { $regex: 'alice', $options: 'i' } },
            { fullName: { $regex: 'alice', $options: 'i' } }
          ]
        },
        { _id: { $ne: mockContext.userId } }
      ]
    });

    expect(queryChain.select).toHaveBeenCalledWith('_id fullName userName profileImage isVerified');
    expect(queryChain.limit).toHaveBeenCalledWith(20);
    expect(queryChain.lean).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
