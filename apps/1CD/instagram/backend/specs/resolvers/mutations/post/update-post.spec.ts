/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updatePost } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        images: ['img1', 'img2'],
        description: 'post Test',
      })
      .mockReturnValueOnce(null),
  },
}));

const input = {
  _id: '1',

  images: ['img1', 'img2'],
  description: 'post Test',
};
describe('Create Post', () => {
  it('should create a post', async () => {
    const result = await updatePost!(
      {},
      {
        input,
      },
      { userId: null },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      images: ['img1', 'img2'],
      description: 'post Test',
    });
  });
  it('should throw a post', async () => {
    try {
      await updatePost!(
        {},
        {
          input,
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not updated post'));
    }
  });
});
