import { GraphQLResolveInfo } from 'graphql';
import { getFollowingUserStories } from '../../../../src/resolvers/queries';
import { followModel } from '../../../../src/models/follow.model';
import { storyModel } from '../../../../src/models/story.model';

jest.mock('../../../../src/models/follow.model', () => ({
  followModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../../src/models/story.model', () => ({
  storyModel: {
    findOne: jest.fn().mockImplementation(() => ({
      populate: jest.fn(),
    })),
  },
}));

describe('getFollowingUserStories', () => {
  const mockFollowData = {
    _id: 'follow1',
    followerId: '1',
    followingId: 'user1',
    status: 'APPROVED',
  };

  const mockStoriesData = {
    _id: 'story1',
    user: {
      _id: 'user1',
      userName: 'User1',
    },
    stories: [
      {
        _id: 'story1-1',
        image: 'image1-1.jpg',
        createdAt: new Date(Date.now()),
      },
      {
        _id: 'story1-2',
        image: 'image1-2.jpg',
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered stories of a followed user within the last 24 hours', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(mockFollowData);
    (storyModel.findOne as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockStoriesData),
    }));

    const result = await getFollowingUserStories!({}, { user: 'user1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({
      followerId: '1',
      followingId: 'user1',
      status: 'APPROVED',
    });

    expect(storyModel.findOne).toHaveBeenCalledWith({
      user: 'user1',
      'stories.createdAt': { $gte: expect.any(Date) },
    });

    expect(result).toEqual({
      _id: 'story1',
      user: {
        _id: 'user1',
        userName: 'User1',
      },
      stories: [
        {
          _id: 'story1-1',
          image: 'image1-1.jpg',
          createdAt: expect.any(Date),
        },
      ],
    });
  });

  it('should throw an error if the user is not following or follow request is not approved', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getFollowingUserStories!({}, { user: 'user1' }, { userId: '1' }, {} as GraphQLResolveInfo)).rejects.toThrow('You are not following this user or the follow request is not approved.');

    expect(followModel.findOne).toHaveBeenCalledWith({
      followerId: '1',
      followingId: 'user1',
      status: 'APPROVED',
    });
    expect(storyModel.findOne).not.toHaveBeenCalled();
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getFollowingUserStories!({}, { user: 'user1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');

    expect(followModel.findOne).not.toHaveBeenCalled();
    expect(storyModel.findOne).not.toHaveBeenCalled();
  });

  it('should return an empty array if no stories are found within the last 24 hours', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(mockFollowData);
    (storyModel.findOne as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({ ...mockStoriesData, stories: [] }),
    }));

    const result = await getFollowingUserStories!({}, { user: 'user1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({
      followerId: '1',
      followingId: 'user1',
      status: 'APPROVED',
    });
    expect(storyModel.findOne).toHaveBeenCalledWith({
      user: 'user1',
      'stories.createdAt': { $gte: expect.any(Date) },
    });
    expect(result).toEqual({
      _id: 'story1',
      user: {
        _id: 'user1',
        userName: 'User1',
      },
      stories: [],
    });
  });
});
