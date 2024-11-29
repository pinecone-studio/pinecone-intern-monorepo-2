import { GraphQLResolveInfo } from 'graphql';
import { followModel } from '../../../src/models/follow.model';
import { userModel } from '../../../src/models/user.model';
import { sendFollowReq } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/user.model.ts');
jest.mock('../../../src/models/follow.model.ts');

describe('sendFollowReq', () => {
  const followerId = 'followerId';
  const followingId = 'followingId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a follow request with status pending for a private account', async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: followingId,
      accountVisibility: 'private',
    });

    (followModel.create as jest.Mock).mockResolvedValueOnce({
      _id: 'requestId',
      followerId,
      followingId,
      status: 'pending',
    });

    const result = await sendFollowReq!({}, { followerId, followingId }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: 'requestId',
      followerId,
      followingId,
      status: 'pending',
    });
    expect(userModel.findById).toHaveBeenCalledWith(followingId);
    expect(followModel.create).toHaveBeenCalledWith({
      followerId,
      followingId,
      status: 'pending',
    });
  });

  it('should create a follow request with status approved for a public account', async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce({
      _id: followingId,
      accountVisibility: 'public',
    });

    (followModel.create as jest.Mock).mockResolvedValueOnce({
      _id: 'requestId',
      followerId,
      followingId,
      status: 'approved',
    });

    const result = await sendFollowReq!({}, { followerId, followingId }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: 'requestId',
      followerId,
      followingId,
      status: 'approved',
    });
    expect(userModel.findById).toHaveBeenCalledWith(followingId);
    expect(followModel.create).toHaveBeenCalledWith({
      followerId,
      followingId,
      status: 'approved',
    });
  });

  it('should throw an error if the user does not exist', async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(sendFollowReq!({}, { followerId, followingId }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('User not found');
    expect(userModel.findById).toHaveBeenCalledWith(followingId);
    expect(followModel.create).not.toHaveBeenCalled();
  });
});
