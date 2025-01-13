/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
import { getMyActiveStories } from '../../../../src/resolvers/queries';
import { storyModel } from '../../../../src/models/story.model';

jest.mock('../../../../src/models/story.model', () => ({
  storyModel: {
    find: jest.fn(),
  },
}));

describe('getMyActiveStories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the active stories for the user within the last 24 hours', async () => {
    const mockStories = [
      {
        _id: 'story1',
        user: { _id: 'user1', userName: 'User1' },
        stories: [
          {
            _id: 'story1-1',
            description: 'Story 1-1',
            image: 'image1-1.jpg',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
        toObject: jest.fn().mockReturnValue({
          _id: 'story1',
          user: { _id: 'user1', userName: 'User1' },
          stories: [
            {
              _id: 'story1-1',
              description: 'Story 1-1',
              image: 'image1-1.jpg',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
          ],
        }),
      },
    ];

    (storyModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(mockStories),
    });

    const result = await getMyActiveStories!({}, {}, { userId: 'user1' }, {} as GraphQLResolveInfo);

    expect(storyModel.find).toHaveBeenCalledWith({ user: 'user1' });
    expect(result).toEqual({
      _id: 'story1',
      user: { _id: 'user1', userName: 'User1' },
      stories: [
        {
          _id: 'story1-1',
          description: 'Story 1-1',
          image: 'image1-1.jpg',
          createdAt: expect.any(Date),
        },
      ],
    });
  });

  it('should handle a story object without a toObject method', async () => {
    const mockStories = [
      {
        _id: 'story2',
        user: { _id: 'user2', userName: 'User2' },
        stories: [
          {
            _id: 'story2-1',
            description: 'Story 2-1',
            image: 'image2-1.jpg',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
      },
    ];

    (storyModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(mockStories),
    });

    const result = await getMyActiveStories!({}, {}, { userId: 'user2' }, {} as GraphQLResolveInfo);

    expect(storyModel.find).toHaveBeenCalledWith({ user: 'user2' });
    expect(result).toEqual({
      _id: 'story2',
      user: { _id: 'user2', userName: 'User2' },
      stories: [
        {
          _id: 'story2-1',
          description: 'Story 2-1',
          image: 'image2-1.jpg',
          createdAt: expect.any(Date),
        },
      ],
    });
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getMyActiveStories!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if no stories are found', async () => {
    (storyModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([]),
    });

    await expect(getMyActiveStories!({}, {}, { userId: 'user1' }, {} as GraphQLResolveInfo)).rejects.toThrow('No stories found or archived');
  });

  // it('should throw an error if no active stories are found', async () => {
  //   const mockStories = [
  //     {
  //       _id: 'story3',
  //       user: { _id: 'user1', userName: 'User1' },
  //       stories: [
  //         {
  //           _id: 'story3-1',
  //           description: 'Story 3-1',
  //           image: 'image3-1.jpg',
  //           createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  //         },
  //       ],
  //     },
  //   ];

  //   (storyModel.find as jest.Mock).mockReturnValueOnce({
  //     populate: jest.fn().mockResolvedValueOnce(mockStories),
  //   });

  //   await expect(getMyActiveStories!({}, {}, { userId: 'user1' }, {} as GraphQLResolveInfo)).rejects.toThrow('No active stories found');
  // });
});
