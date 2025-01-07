import { GraphQLResolveInfo } from 'graphql';
import { Query } from 'mongoose';
import { viewStoryModel } from 'src/models';
import { getStoryViewer } from 'src/resolvers/queries';

jest.mock('../../../../src/models/story-view.model.ts', () => ({
  viewStoryModel: {
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: '12',
        description: 'Story 1',
        image: 'img1',
        createdAt: 'date',
      }),
    }),
  },
}));

describe('getMyStoryViewer query', () => {
  const storyId = '675a8333e5b384d7e785cc07';
  const userId = '675ab2e15cd837b4df939a5b';
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should throw an error if user is not authorized', async () => {
    if (!getStoryViewer) {
      throw new Error('Story not found');
    }

    await expect(getStoryViewer({}, { storyId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return the story if story found', async () => {
    if (!getStoryViewer) {
      throw new Error('Story not found or no viewers');
    }

    const response = await getStoryViewer({}, { storyId }, { userId: userId }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      description: 'Story 1',
      image: 'img1',
      createdAt: 'date',
    });
  });

  it('should throw an error if story not found', async () => {
    if (!getStoryViewer) {
      throw new Error('Story not found or no viewers');
    }

    const wrongId = 'nonexistentId';

    jest.mocked(viewStoryModel.findOne).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null),
      exec: jest.fn(),
    } as unknown as Query<any, any>);

    await expect(getStoryViewer({}, { storyId: wrongId }, { userId: userId }, {} as GraphQLResolveInfo)).rejects.toThrow(`Story not found or no viewers`);
  });
});
