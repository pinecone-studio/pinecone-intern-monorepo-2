import { GraphQLResolveInfo } from 'graphql';
import { followModel } from 'src/models/follow.model';
import { getSuggestUser } from 'src/resolvers/queries';

jest.mock('src/models/follow.model', () => ({
  followModel: {
    find: jest.fn(() => ({
      populate: jest.fn().mockReturnValue([]),
    })),
  },
}));

describe('getSuggestUser', () => {
  const mockUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getSuggestUser!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return suggested users excluding duplicates and the user themselves', async () => {
    const mockMyFollowings = [
      { followerId: 'user123', followingId: { _id: 'user2' } },
      { followerId: 'user123', followingId: { _id: 'user3' } },
    ];

    const mockFollowingsOfFollowings = [
      { followingId: { _id: 'user2' }, followerId: { _id: 'user4' } },
      { followingId: { _id: 'user2' }, followerId: { _id: 'user3' } },
      { followingId: { _id: 'user3' }, followerId: { _id: 'user4' } },
      { followingId: { _id: 'user3' }, followerId: { _id: 'user123' } },
    ];

    // const SuggestFollowingsWithUser = [
    //   { followingId: { _id: 'user2' }, followerId: { _id: 'user4' } },
    //   { followingId: { _id: 'user3' }, followerId: { _id: 'user4' } },
    //   { followingId: { _id: 'user3' }, followerId: { _id: 'user123' } },
    // ];
    // const SuggestFollowerDuplicate = [
    //   { followingId: { _id: 'user2' }, followerId: { _id: 'user4' } },
    //   { followingId: { _id: 'user3' }, followerId: { _id: 'user4' } },
    // ];

    // const SuggestUser = [{ followingId: { _id: 'user3' }, followerId: { _id: 'user4' } }];

    const mockFind = followModel.find as jest.Mock;

    mockFind
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce(mockMyFollowings),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({ populate: jest.fn().mockReturnValueOnce(mockFollowingsOfFollowings) }),
      });

    const result = await getSuggestUser!({}, {}, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(result).toEqual([
      { followingId: { _id: 'user2' }, followerId: { _id: 'user4' } },
      { followingId: { _id: 'user2' }, followerId: { _id: 'user3' } },
      { followingId: { _id: 'user3' }, followerId: { _id: 'user4' } },
      { followingId: { _id: 'user3' }, followerId: { _id: 'user123' } },
    ]);
  });
});
