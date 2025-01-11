import { GraphQLResolveInfo } from 'graphql';
import { getPublicAccStories } from '../../../../src/resolvers/queries';
import { userModel, storyModel } from '../../../../src/models';
import { AccountVisibility } from 'src/generated';

jest.mock('../../../../src/models/user.model.ts', () => ({
  userModel: {
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

describe('getPublicAccStories', () => {
  const mockPublicUser = {
    _id: 'user1',
    userName: 'PublicUser',
    accountVisibility: AccountVisibility.Public,
  };

  const mockStoriesData = {
    _id: 'story1',
    user: mockPublicUser,
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

  it('should throw an error if user is not authenticated', async () => {
    await expect(getPublicAccStories!({}, { user: 'user1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');

    expect(userModel.findOne).not.toHaveBeenCalled();
    expect(storyModel.findOne).not.toHaveBeenCalled();
  });

  it('should throw an error if the user is not found or is not public', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getPublicAccStories!({}, { user: 'user1' }, { userId: 'userId' }, {} as GraphQLResolveInfo)).rejects.toThrow('User not found');

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'user1', accountVisibility: AccountVisibility.Public });
    expect(storyModel.findOne).not.toHaveBeenCalled();
  });

  it('should return filtered stories within the last 24 hours for a public account', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockPublicUser);
    (storyModel.findOne as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockStoriesData),
    }));

    const result = await getPublicAccStories!({}, { user: 'user1' }, { userId: 'userId' }, {} as GraphQLResolveInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'user1', accountVisibility: AccountVisibility.Public });
    expect(storyModel.findOne).toHaveBeenCalledWith({
      user: mockPublicUser,
      'stories.createdAt': { $gte: expect.any(Date) },
    });

    expect(result).toEqual({
      _id: 'story1',
      user: mockPublicUser,
      stories: [
        {
          _id: 'story1-1',
          image: 'image1-1.jpg',
          createdAt: expect.any(Date),
        },
      ],
    });
  });

  it('should return an empty array if no stories are found within the last 24 hours', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockPublicUser);
    (storyModel.findOne as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({ ...mockStoriesData, stories: [] }),
    }));

    const result = await getPublicAccStories!({}, { user: 'user1' }, { userId: 'userId' }, {} as GraphQLResolveInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'user1', accountVisibility: AccountVisibility.Public });
    expect(storyModel.findOne).toHaveBeenCalledWith({
      user: mockPublicUser,
      'stories.createdAt': { $gte: expect.any(Date) },
    });

    expect(result).toEqual({
      _id: 'story1',
      user: mockPublicUser,
      stories: [],
    });
  });
});
