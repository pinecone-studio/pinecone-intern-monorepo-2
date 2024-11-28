/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createPost } from '../../../../src/resolvers/mutations';
import { PostModel, userModel } from '../../../../src/models';

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
  userModel: {
    findById: jest.fn(),
    // .mockResolvedValueOnce({
    //   _id: '1',
    //   user: '673f6ec003387ea426252c1a',
    //   images: ['img1', 'img2'],
    //   description: 'post Test',
    // })
    // .mockResolvedValueOnce(null)
    // .mockResolvedValueOnce({
    //   _id: '1',
    //   user: '673f6ec003387ea426252c1a',
    //   images: ['img1', 'img2'],
    //   description: 'post Test',
    // }),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue({ _id: '1', user: '673f6ec003387ea426252c1a', images: ['img1', 'img2'], description: 'post Test' });
    (PostModel.create as jest.Mock).mockResolvedValue({ _id: '1', user: '673f6ec003387ea426252c1a', images: ['img1', 'img2'], description: 'post Test' });

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

  it('Not found user', async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce(null);

    try {
      await createPost!(
        {},
        {
          user: '1',
          images: [],
          description: 'post Test',
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Not found user'));
    }
  });

  it('Can not create post', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue({ _id: '1', user: '673f6ec003387ea426252c1a', images: ['img1', 'img2'], description: 'post Test' });
    (PostModel.create as jest.Mock).mockResolvedValue(null);
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
