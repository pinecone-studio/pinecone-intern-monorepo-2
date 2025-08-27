import { UserInputError } from 'apollo-server-express';
import { Types } from 'mongoose';
import { followUser } from 'src/resolvers/mutations/follow/follow-user';
import { User, FollowRequest, FollowRequestStatus } from 'src/models';

jest.mock('src/models', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  FollowRequest: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  FollowRequestStatus: {
    PENDING: 'PENDING',
  },
}));

describe('followUser', () => {
  const currentUserId = new Types.ObjectId().toHexString();
  const targetUserId = new Types.ObjectId().toHexString();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if user tries to follow themselves', async () => {
    await expect(followUser({}, { targetUserId: currentUserId }, { userId: currentUserId })).rejects.toThrow(UserInputError);
  });

  it('should throw error if target user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(followUser({}, { targetUserId }, { userId: currentUserId })).rejects.toThrow(UserInputError);
  });

  it('should handle private user follow request successfully', async () => {
    (User.findById as jest.Mock).mockResolvedValue({ isPrivate: true });
    (FollowRequest.findOne as jest.Mock).mockResolvedValue(null);
    (FollowRequest.create as jest.Mock).mockResolvedValue({ id: 'req123' });

    const result = await followUser({}, { targetUserId }, { userId: currentUserId });

    expect(FollowRequest.findOne).toHaveBeenCalledWith({
      receiverId: targetUserId,
      requesterId: currentUserId,
      status: FollowRequestStatus.PENDING,
    });

    expect(FollowRequest.create).toHaveBeenCalledWith({
      receiverId: targetUserId,
      requesterId: currentUserId,
      status: FollowRequestStatus.PENDING,
    });

    expect(result).toEqual({
      success: true,
      message: 'Follow хүсэлт илгээгдлээ.',
      request: { id: 'req123' },
    });
  });

  it('should throw error if private follow request already exists', async () => {
    (User.findById as jest.Mock).mockResolvedValue({ isPrivate: true });
    (FollowRequest.findOne as jest.Mock).mockResolvedValue({ id: 'req123' });

    await expect(followUser({}, { targetUserId }, { userId: currentUserId })).rejects.toThrow(UserInputError);
  });

  it('should handle public user follow successfully', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ isPrivate: false }) // targetUser
      .mockResolvedValueOnce({}); // currentUser

    const result = await followUser({}, { targetUserId }, { userId: currentUserId });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(currentUserId, {
      $addToSet: { followings: targetUserId },
    });

    expect(result).toEqual({ success: true, message: 'Амжилттай дагалаа.' });
  });

  it('should throw error if target user not found in public follow', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(followUser({}, { targetUserId }, { userId: currentUserId })).rejects.toThrow(UserInputError);
  });

  it('should throw error if current user not found in public follow', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ isPrivate: false }) // targetUser
      .mockResolvedValueOnce(null); // currentUser

    await expect(followUser({}, { targetUserId }, { userId: currentUserId })).rejects.toThrow(UserInputError);
  });
});
