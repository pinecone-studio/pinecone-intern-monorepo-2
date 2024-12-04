/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateReply } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/reply-model.ts', () => ({
  ReplyModel: {
    findbyIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        description: 'rf',
      })
      .mockResolvedValueOnce(null),
  },
}));
const input = {
  _id: '1',
  description: 'rf',
};

describe('update Reply', () => {
  it('should update a reply', async () => {
    const result = await updateReply!(
      {},
      {
        input,
      },
      { userId: null },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      description: 'rf',
    });
  });
  it('should throw a reply', async () => {
    try {
      await updateReply!(
        {},
        {
          input,
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not updated reply'));
    }
  });
});
