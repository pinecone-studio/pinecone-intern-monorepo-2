import { Types } from 'mongoose';
import { User, FollowRequest, FollowRequestStatus } from 'src/models';
import { acceptFollowRequest } from 'src/resolvers/mutations/follow/accept-follow-request';
import { UserInputError, AuthenticationError } from 'apollo-server-express';

jest.mock('src/models', () => ({
  User: {
    findById: jest.fn(),
  },
  FollowRequest: {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  },
  FollowRequestStatus: {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
  },
}));

describe('acceptFollowRequest', () => {
  const requesterId = new Types.ObjectId();
  const receiverId = new Types.ObjectId();

  const fakeUser: any = {
    _id: receiverId,
    followers: [],
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fakeUser.followers = []; // Reset followers array
    fakeUser.save.mockClear();
  });

  it('should throw AuthenticationError if user not logged in', async () => {
    await expect(acceptFollowRequest({}, { requesterId: requesterId.toHexString() }, { userId: undefined })).rejects.toThrow(AuthenticationError);
  });

  it('should throw UserInputError if pending request not found', async () => {
    (FollowRequest.findOne as jest.Mock).mockResolvedValue(null);

    await expect(acceptFollowRequest({}, { requesterId: requesterId.toHexString() }, { userId: receiverId.toHexString() })).rejects.toThrow(UserInputError);
  });

  it('should add follower if not already in followers', async () => {
    (FollowRequest.findOne as jest.Mock).mockResolvedValue({ id: 'req123' });
    (User.findById as jest.Mock).mockResolvedValue(fakeUser);

    const result = await acceptFollowRequest({}, { requesterId: requesterId.toHexString() }, { userId: receiverId.toHexString() });

    expect(FollowRequest.findOne).toHaveBeenCalledWith({
      receiverId: receiverId.toHexString(),
      requesterId: requesterId.toHexString(),
      status: FollowRequestStatus.PENDING,
    });
    expect(FollowRequest.updateOne).toHaveBeenCalledWith({ receiverId: receiverId.toHexString(), requesterId: requesterId.toHexString() }, { status: FollowRequestStatus.ACCEPTED });
    expect(fakeUser.followers).toContainEqual(requesterId);
    expect(fakeUser.save).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Follow хүсэлтийг зөвшөөрлөө.' });
  });

  it('should not duplicate follower if already exists', async () => {
    // ObjectId-тай адил байдлаар mock хийе
    const mockFollowerId = {
      equals: jest.fn().mockReturnValue(true), // энэ нь comparison-г амжилттай болгоно
      toString: () => requesterId.toString(),
    };

    fakeUser.followers = [mockFollowerId]; // follower аль хэдийн байгаа
    (FollowRequest.findOne as jest.Mock).mockResolvedValue({ id: 'req123' });
    (User.findById as jest.Mock).mockResolvedValue(fakeUser);

    const result = await acceptFollowRequest({}, { requesterId: requesterId.toHexString() }, { userId: receiverId.toHexString() });

    expect(fakeUser.followers.length).toBe(1);
    expect(fakeUser.save).not.toHaveBeenCalled(); // save дуудагдах ёсгүй
    expect(result).toEqual({ success: true, message: 'Follow хүсэлтийг зөвшөөрлөө.' });
  });
});
