import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { followModel } from 'src/models/follow.model';
import { confirmFollowReq } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/follow.model.ts', () => ({
  followModel: {
    findOne: jest.fn(),
  },
}));

describe('confirmFollowReq Mutation', () => {
  const mockSave = jest.fn();
  const mockFollowRequest = {
    followerId: '123',
    followingId: 'user-1',
    status: FollowStatus.Pending,
    save: mockSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not authenticated', async () => {
    await expect(confirmFollowReq!({}, { followerId: '123' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if follow request is not found', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(confirmFollowReq!({}, { followerId: '12' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('Follow request not found');
  });

  it('should throw an error if user is not authorized to confirm the request', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockFollowRequest,
      followingId: 'user-2',
    });

    await expect(confirmFollowReq!({}, { followerId: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('You are not authorized to confirm this follow request');
  });

  it('should throw an error if the follow request is already approved', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockFollowRequest,
      status: FollowStatus.Approved,
    });

    await expect(confirmFollowReq!({}, { followerId: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('Follow request has already been confirmed');
  });

  it('should successfully confirm the follow request', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce(mockFollowRequest);

    const result = await confirmFollowReq!({}, { followerId: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo);

    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockFollowRequest,
      status: FollowStatus.Approved,
    });
  });
});
