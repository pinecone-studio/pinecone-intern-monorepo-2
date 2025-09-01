// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-failure.spec.ts
import { Types } from 'mongoose';
import { swipe } from '../../../src/utils/swipe-core';
import { User, Swipe } from '../../../src/models';
import { SwipeInput } from '../../../src/types/swipe-types';

// Mock the swipe-utils module
jest.mock('../../../src/utils/swipe-utils', () => ({
  findNextAvailableProfile: jest.fn(),
  getSwipedUserIds: jest.fn(),
}));

// Import the mocked functions
import { findNextAvailableProfile, getSwipedUserIds } from '../../../src/utils/swipe-utils';

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

  it('should handle non-LIKE actions without creating a match', async () => {
    const actions = ['DISLIKE', 'SUPER_LIKE'] as const;
    
    for (const action of actions) {
      const actionInput: SwipeInput = { ...mockInput, action };
      (User.findById as jest.Mock)
        .mockResolvedValueOnce({ _id: mockSwiperId })
        .mockResolvedValueOnce({ _id: mockTargetId });
      (Swipe.findOne as jest.Mock).mockResolvedValue(null);
      (Swipe.create as jest.Mock).mockResolvedValue({});
      
      // Mock the utility functions properly
      (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
      (findNextAvailableProfile as jest.Mock).mockResolvedValue(null);

      const result = await swipe(null, { input: actionInput });

      expect(result.success).toBe(true);
      expect(result.response).toBe('SUCCESS');
      expect(result.match).toBeNull();
      expect(result.nextProfile).toBeNull();
      expect(Swipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          swiperId: new Types.ObjectId(mockSwiperId),
          targetId: new Types.ObjectId(mockTargetId),
          action,
        })
      );
      
      jest.clearAllMocks();
    }
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