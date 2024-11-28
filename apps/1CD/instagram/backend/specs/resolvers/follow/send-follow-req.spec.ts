import { GraphQLResolveInfo } from 'graphql';
import { sendFollowReq } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/user.model.ts', () => ({
  userModel: {
    findById: jest.fn().mockResolvedValueOnce({ _id: '3', name: 'Test User' }).mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '3', name: 'Test User' }),
  },
}));

jest.mock('../../../src/models/follow.model.ts', () => ({
  followModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        followerId: '2',
        followingId: '3',
        status: 'a',
      })
      .mockRejectedValueOnce(new Error('could not send follow request')),
  },
}));

describe('Create follow request', () => {
  it('should create a follow request', async () => {
    const response = await sendFollowReq!(
      {},
      {
        followerId: '2',
        followingId: '3',
        status: 'a',
      },
      {},
      {} as GraphQLResolveInfo
    );

    expect(response).toEqual({
      _id: '1',
      followerId: '2',
      followingId: '3',
      status: 'a',
    });
  });

  it('should not follow if user does not exist', async () => {
    try {
      await sendFollowReq!({}, { followerId: '2', followingId: '3', status: 'a' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found'));
    }
  });

  it('could not send follow request', async () => {
    try {
      await sendFollowReq!(
        {},
        {
          followerId: '2',
          followingId: '3',
          status: 'a',
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('could not send follow request'));
    }
  });
});
