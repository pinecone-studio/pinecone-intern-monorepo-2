/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createReply } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/reply-model.ts', () => ({
  ReplyModel: {
    create: jest.fn().mockResolvedValue({
      _id: '1',
      description: 's',
      userID: '673f738103387ea426252c1e',
      commentID: 'a231',
    }),
  },
}));
const input = {
  description: 's',
  userID: '673f738103387ea426252c1e',
  commentID: 'a231',
};
describe('Create Reply', () => {
  it('should create a reply', async () => {
    const response = await createReply!(
      {},
      {
        input,
      },
      { userId: null },
      {} as GraphQLResolveInfo
    );
    expect(response).toEqual({
      _id: '1',
      description: 's',
      user: '673f738103387ea426252c1e',
      commentID: 'a231',
    });
  });
});
