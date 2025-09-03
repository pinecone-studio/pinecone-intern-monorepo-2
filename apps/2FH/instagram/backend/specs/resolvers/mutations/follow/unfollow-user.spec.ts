import { User } from 'src/models';

import { Types } from 'mongoose';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { unfollowUser } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  FollowRequest: {
    findOne: jest.fn(),
  },
}));

describe('unfollowUser mutation', () => {
  const targetUserId = new Types.ObjectId().toHexString();
  const currentUserId = new Types.ObjectId().toHexString();

  const context = { userId: currentUserId };

  let mockTargetUser: any;
  let mockCurrentUser: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTargetUser = {
      _id: new Types.ObjectId(targetUserId),
      followers: [new Types.ObjectId(currentUserId)],
    };

    mockCurrentUser = {
      _id: new Types.ObjectId(currentUserId),
      followings: [new Types.ObjectId(targetUserId)],
    };

    (User.findById as jest.Mock).mockImplementation((id: string) => {
      if (id === targetUserId) return mockTargetUser;
      if (id === currentUserId) return mockCurrentUser;
      return null;
    });

    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);
  });

  it('successfully unfollows a user', async () => {
    const result = await unfollowUser({}, { targetUserId }, context);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Unfollow амжилттай боллоо.');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(targetUserId, { $pull: { followers: currentUserId } });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(currentUserId, { $pull: { followings: targetUserId } });
  });

  it('throws error when user tries to unfollow themselves', async () => {
    await expect(unfollowUser({}, { targetUserId: currentUserId }, context)).rejects.toThrow(UserInputError);
  });

  it('throws error if target user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(unfollowUser({}, { targetUserId }, context)).rejects.toThrow(UserInputError);
  });

  it('throws AuthenticationError if not logged in', async () => {
    await expect(unfollowUser({}, { targetUserId }, { userId: undefined })).rejects.toThrow(AuthenticationError);
  });
});
