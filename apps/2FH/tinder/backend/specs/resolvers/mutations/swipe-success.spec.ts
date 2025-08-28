// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-success.spec.ts
import { Types } from 'mongoose';
import { swipe } from '../../../src/utils/swipe-core';
import { Swipe, User, Profile as ProfileModel } from 'src/models';
import { SwipeInput } from '../../../src/types/swipe-types';

// Mock the swipe-utils module
jest.mock('../../../src/utils/swipe-utils', () => ({
  findNextAvailableProfile: jest.fn(),
  getSwipedUserIds: jest.fn(),
}));

// Mock the swipe-helpers module
jest.mock('../../../src/utils/swipe-helpers', () => ({
  syncExistingMatches: jest.fn(),
  handleExistingSwipe: jest.fn(),
  handleNewLike: jest.fn(),
  getSwipedUserIds: jest.fn(),
}));

jest.mock('src/models', () => ({
  Swipe: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    distinct: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

// Import the mocked functions
import { findNextAvailableProfile } from '../../../src/utils/swipe-utils';
import { syncExistingMatches, handleExistingSwipe, handleNewLike, getSwipedUserIds } from '../../../src/utils/swipe-helpers';

describe('Swipe Success Cases', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();
  const mockNextProfileId = new Types.ObjectId().toString();
  const mockInput: SwipeInput = {
    swiperId: mockSwiperId,
    targetId: mockTargetId,
    action: 'LIKE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new swipe and return success response', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockResolvedValue({});
    (ProfileModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});
    
    // Mock the utility functions
    (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
    (findNextAvailableProfile as jest.Mock).mockResolvedValue({
      userId: mockNextProfileId,
      name: 'Next User',
      images: ['image1.jpg'],
      profession: 'Developer',
    });

    const result = await swipe(null, { input: mockInput });

    expect(result).toEqual({
      success: true,
      message: 'Successfully liked profile',
      response: 'SUCCESS',
      match: undefined,
      nextProfile: {
        userId: mockNextProfileId,
        name: 'Next User',
        images: ['image1.jpg'],
        profession: 'Developer',
      },
    });
    expect(Swipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        swiperId: new Types.ObjectId(mockSwiperId),
        targetId: new Types.ObjectId(mockTargetId),
        action: 'LIKE',
      })
    );
  });

  it('should create a match when mutual like exists', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockResolvedValue({});
    
    // Mock the helper functions
    (syncExistingMatches as jest.Mock).mockResolvedValue(undefined);
    (handleNewLike as jest.Mock).mockResolvedValue({
      likeduserId: { userId: mockSwiperId, name: 'Swiper' },
      matcheduserId: { userId: mockTargetId, name: 'Target' },
    });
    
    // Mock the utility functions
    (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
    (findNextAvailableProfile as jest.Mock).mockResolvedValue(null);

    const result = await swipe(null, { input: mockInput });

    expect(result.response).toBe('MATCH_CREATED');
    expect(handleNewLike).toHaveBeenCalledWith(
      new Types.ObjectId(mockSwiperId),
      new Types.ObjectId(mockTargetId),
      mockSwiperId
    );
  });

  it('should handle existing swipe case', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue({ action: 'LIKE' });
    
    // Mock the helper functions
    (syncExistingMatches as jest.Mock).mockResolvedValue(undefined);
    (handleExistingSwipe as jest.Mock).mockResolvedValue({
      likeduserId: { userId: mockSwiperId, name: 'Swiper' },
      matcheduserId: { userId: mockTargetId, name: 'Target' },
    });
    
    // Mock the utility functions
    (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
    (findNextAvailableProfile as jest.Mock).mockResolvedValue(null);

    const result = await swipe(null, { input: mockInput });

    expect(result.response).toBe('ALREADY_SWIPED');
    expect(handleExistingSwipe).toHaveBeenCalledWith(
      { action: 'LIKE' },
      new Types.ObjectId(mockSwiperId),
      new Types.ObjectId(mockTargetId)
    );
  });
});