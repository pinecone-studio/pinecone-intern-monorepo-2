/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createPost } from '../../../../src/resolvers/mutations';
import { PostModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  PostModel: {
    create: jest.fn(),
    // .mockResolvedValueOnce({
    //   _id: '1',
    //   user: '673f6ec003387ea426252c1a',
    //   images: ['img1', 'img2'],
    //   description: 'post Test',
    // })
    // .mockResolvedValueOnce(null),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    (PostModel.create as jest.Mock).mockResolvedValue({ _id: '1', user: 'user1', images: ['img1', 'img2'], description: 'post Test' });

    const result = await createPost!(
      {},
      {
        images: ['img1', 'img2'],
        description: 'post Test',
      },
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      user: 'user1',
      images: ['img1', 'img2'],
      description: 'post Test',
    });
  });

  it('Can not create post', async () => {
    try {
      await createPost!(
        {},
        {
          images: [],
          description: 'post Test',
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
});
