// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-failure.spec.ts
import { Types } from 'mongoose';
import { swipe } from '../../../src/utils/swipe-core';
import { User, Swipe, ProfileModel } from 'src/models';
import { SwipeInput } from '../../../src/types/swipe-types';

jest.mock('src/models', () => ({
  User: {
    findById: jest.fn(),
  },
  Swipe: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    distinct: jest.fn(),
  },
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Failure Cases', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();
  const mockInput: SwipeInput = {
    swiperId: mockSwiperId,
    targetId: mockTargetId,
    action: 'LIKE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError for invalid user IDs', async () => {
    const invalidInput: SwipeInput = { ...mockInput, swiperId: 'invalid-id' };
    await expect(swipe(null, { input: invalidInput })).rejects.toThrow(
      'Swipe failed: Invalid user ID format',
    );
  });

  it('should throw GraphQLError when swiping on own profile', async () => {
    const selfSwipeInput: SwipeInput = { ...mockInput, targetId: mockSwiperId };
    await expect(swipe(null, { input: selfSwipeInput })).rejects.toThrow(
      'Swipe failed: Cannot swipe on your own profile',
    );
  });

  it('should throw GraphQLError if one or both users not found', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce(null) // Swiper not found
      .mockResolvedValueOnce({ _id: mockTargetId }); // Target exists
    await expect(swipe(null, { input: mockInput })).rejects.toThrow(
      'Swipe failed: One or both users not found',
    );
  });

  it('should handle DISLIKE action without creating a match', async () => {
    const dislikeInput: SwipeInput = { ...mockInput, action: 'DISLIKE' };
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockResolvedValue({});
    (Swipe.find as jest.Mock).mockReturnValue({
      distinct: jest.fn().mockResolvedValue([mockSwiperId, mockTargetId]),
    });
    (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    const result = await swipe(null, { input: dislikeInput });

    expect(result).toEqual({
      success: true,
      message: 'Successfully disliked profile',
      response: 'SUCCESS',
      match: null,
      nextProfile: null,
    });
    expect(Swipe.create).toHaveBeenCalledWith({
      swiperId: mockSwiperId,
      targetId: mockTargetId,
      action: 'DISLIKE',
    });
  });

  it('should handle SUPER_LIKE action without creating a match', async () => {
    const superLikeInput: SwipeInput = { ...mockInput, action: 'SUPER_LIKE' };
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockResolvedValue({});
    (Swipe.find as jest.Mock).mockReturnValue({
      distinct: jest.fn().mockResolvedValue([mockSwiperId, mockTargetId]),
    });
    (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    const result = await swipe(null, { input: superLikeInput });

    expect(result).toEqual({
      success: true,
      message: 'Successfully super_liked profile',
      response: 'SUCCESS',
      match: null,
      nextProfile: null,
    });
    expect(Swipe.create).toHaveBeenCalledWith({
      swiperId: mockSwiperId,
      targetId: mockTargetId,
      action: 'SUPER_LIKE',
    });
  });

  it('should handle errors in swipe creation', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(swipe(null, { input: mockInput })).rejects.toThrow(
      'Swipe failed: Database error',
    );
  });
});