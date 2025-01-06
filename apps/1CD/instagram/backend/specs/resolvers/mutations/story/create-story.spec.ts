import { GraphQLResolveInfo } from 'graphql';
import { storyModel } from 'src/models';
import { createStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    create: jest.fn(),
  },
}));

describe('Create Story', () => {
  const mockInput = {
    _id: 'id',
    image: 'img',
    description: 'des',
    userId: 'userId',
    createdAt: new Date('2025-01-02T00:00:00Z'),
  };

  it('should create a story with a 24-hour filter applied', async () => {
    const expectedEndDate = new Date(mockInput.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString();

    (storyModel.create as jest.Mock).mockResolvedValue({
      ...mockInput,
      endDate: expectedEndDate,
    });

    const result = await createStory!(
      {},
      {
        input: mockInput,
      },
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: 'id',
      image: 'img',
      description: 'des',
      userId: 'userId',
      createdAt: mockInput.createdAt,
      endDate: expectedEndDate,
    });
  });

  it('should throw an error if userId is null', async () => {
    try {
      await createStory!(
        {},
        {
          input: mockInput,
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
});
