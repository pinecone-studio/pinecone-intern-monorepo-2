import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { FollowRequest, FollowRequestStatus } from 'src/models';
import { rejectFollowRequest } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  FollowRequest: {
    findById: jest.fn(),
  },
  FollowRequestStatus: {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
  },
}));

describe('rejectFollowRequest', () => {
  const validReceiverId = '64a5fbedfbedfbedfbedfbed';
  const context = { userId: validReceiverId };
  const requestId = 'req123';
  const followRequestMock: any = {
    _id: requestId,
    receiverId: validReceiverId,
    requesterId: '64a5fbddfbddfbddfbddfbdd',
    status: 'PENDING',
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should throw AuthenticationError if not logged in', async () => {
    await expect(rejectFollowRequest({}, { requestId }, {})).rejects.toThrow(AuthenticationError);
  });

  it('should throw if request not found', async () => {
    (FollowRequest.findById as jest.Mock).mockResolvedValue(null);
    await expect(rejectFollowRequest({}, { requestId }, context)).rejects.toThrow(UserInputError);
  });

  it('should throw if not receiver', async () => {
    (FollowRequest.findById as jest.Mock).mockResolvedValue({ ...followRequestMock, receiverId: 'other' });
    await expect(rejectFollowRequest({}, { requestId }, context)).rejects.toThrow(/татгалзах эрх байхгүй/);
  });

  it('should reject successfully', async () => {
    (FollowRequest.findById as jest.Mock).mockResolvedValue(followRequestMock);

    const result = await rejectFollowRequest({}, { requestId }, context);
    expect(followRequestMock.status).toBe(FollowRequestStatus.REJECTED);
    expect(followRequestMock.save).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Follow хүсэлтийг татгалзлаа.' });
  });
});
