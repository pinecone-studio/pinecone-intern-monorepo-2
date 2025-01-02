/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { storyModel } from 'src/models';
import { createStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    create: jest.fn(),
  },
}));

describe('Create Post', () => {
  const mockInput = {
    _id: 'id',
    image: 'img',
    description: 'des',
    userId: 'userId',
    createdAt: '2025-01-02',
  };
  it('should create a post', async () => {
    (storyModel.create as jest.Mock).mockResolvedValue({ input: mockInput });

    const result = await createStory!(
      {},
      {
        input: mockInput,
      },
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      input: {
        _id: 'id',
        image: 'img',
        description: 'des',
        userId: 'userId',
        createdAt: '2025-01-02',
      },
    });
  });

  it('Can not create story', async () => {
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
