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
    if (!getMyStory) {
      throw new Error('Story not found');
    }

    await expect(getMyStory({}, { _id: storyId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return the story if story found', async () => {
    if (!getMyStory) {
      throw new Error('Story not found');
    }

    const response = await getMyStory({}, { _id: storyId }, { userId: userId }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      description: 'Post 1',
      image: 'img1',
      createdAt: 'date',
    });
  });

  it('should throw an error if story not found', async () => {
    if (!getMyStory) {
      throw new Error('Story not found');
    }

    const wrongId = 'nonexistentId';

    jest.mocked(storyModel.findOne).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null),
      exec: jest.fn(),
    } as unknown as Query<any, any>);

    await expect(getMyStory({}, { _id: wrongId }, { userId: userId }, {} as GraphQLResolveInfo)).rejects.toThrow(`Story not found`);
  });
});
