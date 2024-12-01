/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createPost } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        user: '673f6ec003387ea426252c1a',
        images: ['img1', 'img2'],
        description: 'post Test',
      })
      .mockResolvedValueOnce(null),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    const result = await createPost!(
      {},
      {
        user: '673f6ec003387ea426252c1a',
        images: ['img1', 'img2'],
        description: 'post Test',
      },
      {},
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      user: '673f6ec003387ea426252c1a',
      images: ['img1', 'img2'],
      description: 'post Test',
    });
  });

  it('Can not create post', async () => {
    try {
      await createPost!(
        {},
        {
          user: '673f6ec003387ea426252c1a',
          images: [],
          description: 'post Test',
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not create post'));
    }
  });
});
