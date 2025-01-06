import { GraphQLResolveInfo } from 'graphql';
import { Query } from 'mongoose';
import { storyModel } from 'src/models';
import { getMyStory } from 'src/resolvers/queries';

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: '12',
        description: 'Post 1',
        image: 'img1',
        createdAt: 'date',
        userId: { _id: '675ab2e15cd837b4df939a5b' },
      }),
    }),
  },
}));

describe('getMyStory query', () => {
  const storyId = '675a8333e5b384d7e785cc07';
  const userId = '675ab2e15cd837b4df939a5b';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not authorized', async () => {
    await expect(getMyStory!({}, { _id: storyId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return the story if story is found and user is authorized', async () => {
    const response = await getMyStory!({}, { _id: storyId }, { userId: userId }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      description: 'Post 1',
      image: 'img1',
      createdAt: 'date',
      userId: { _id: '675ab2e15cd837b4df939a5b' },
    });
  });

  it('should throw an error if the user is not allowed to see the story', async () => {
    jest.mocked(storyModel.findOne).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue({
        _id: '12',
        description: 'Post 1',
        image: 'img1',
        createdAt: 'date',
        userId: { _id: 'different-user-id' },
      }),
    } as unknown as Query<any, any>);

    await expect(getMyStory!({}, { _id: storyId }, { userId: userId }, {} as GraphQLResolveInfo)).rejects.toThrow('You are not allowed to see this story info');
  });

  it('should throw an error if the story is not found or archived', async () => {
    jest.mocked(storyModel.findOne).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null),
    } as unknown as Query<any, any>);

    await expect(getMyStory!({}, { _id: storyId }, { userId: userId }, {} as GraphQLResolveInfo)).rejects.toThrow('Story not found or is archieved');
  });
});
