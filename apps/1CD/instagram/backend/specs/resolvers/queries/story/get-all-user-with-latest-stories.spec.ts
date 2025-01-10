import { GraphQLResolveInfo } from 'graphql';
import { getAllUsersWithLatestStories } from '../../../../src/resolvers/queries';
import { followModel } from '../../../../src/models/follow.model';
import { storyModel } from '../../../../src/models/story.model';

jest.mock('../../../../src/models/follow.model', () => ({
  followModel: {
    find: jest.fn(),
  },
}));

jest.mock('../../../../src/models/story.model', () => ({
  storyModel: {
    find: jest.fn().mockImplementation(() => ({
      populate: jest.fn(),
    })),
  },
}));

describe('getAllUsersWithLatestStories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted stories from approved followings within the last 24 hours', async () => {
    (followModel.find as jest.Mock).mockResolvedValueOnce([
      { followerId: '1', status: 'APPROVED', followingId: 'user1' },
      { followerId: '1', status: 'APPROVED', followingId: 'user2' },
    ]);

    (storyModel.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce([
        {
          _id: 'story1',
          user: {
            _id: 'user1',
            userName: 'User1',
          },
          stories: [
            {
              _id: 'story1-1',
              createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
              image: 'image1-1.jpg',
            },
          ],
        },
        {
          _id: 'story2',
          user: {
            _id: 'user2',
            userName: 'User2',
          },
          stories: [
            {
              _id: 'story2-1',
              createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
              image: 'image2-1.jpg',
            },
          ],
        },
      ]),
    }));

    const result = await getAllUsersWithLatestStories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(followModel.find).toHaveBeenCalledWith({ followerId: '1' });
    expect(storyModel.find).toHaveBeenCalledWith(
      {
        user: { $in: ['user1', 'user2'] },
        'stories.createdAt': { $gte: expect.any(Date) },
      }
      // { stories: { $slice: -1 } }
    );
    expect(result).toEqual([
      {
        _id: 'story2',
        user: {
          _id: 'user2',
          userName: 'User2',
        },
        stories: [
          {
            _id: 'story2-1',
            createdAt: expect.any(Date),
            image: 'image2-1.jpg',
          },
        ],
      },
      {
        _id: 'story1',
        user: {
          _id: 'user1',
          userName: 'User1',
        },
        stories: [
          {
            _id: 'story1-1',
            createdAt: expect.any(Date),
            image: 'image1-1.jpg',
          },
        ],
      },
    ]);
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getAllUsersWithLatestStories!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return an empty array if no approved followings exist', async () => {
    (followModel.find as jest.Mock).mockResolvedValueOnce([]);

    const result = await getAllUsersWithLatestStories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(followModel.find).toHaveBeenCalledWith({ followerId: '1' });
    expect(storyModel.find).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return an empty array if no stories are found within the last 24 hours', async () => {
    (followModel.find as jest.Mock).mockResolvedValueOnce([{ followerId: '1', status: 'APPROVED', followingId: 'user1' }]);

    (storyModel.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce([]),
    }));

    const result = await getAllUsersWithLatestStories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(followModel.find).toHaveBeenCalledWith({ followerId: '1' });
    expect(storyModel.find).toHaveBeenCalledWith(
      {
        user: { $in: ['user1'] },
        'stories.createdAt': { $gte: expect.any(Date) },
      }
      // { stories: { $slice: -1 } }
    );
    expect(result).toEqual([]);
  });
});
