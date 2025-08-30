// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-success.spec.ts
import { Types } from 'mongoose';
import { swipe } from '../../../src/utils/swipe-core';
import { Swipe, User, Profile as ProfileModel } from 'src/models';
import { SwipeInput } from '../../../src/types/swipe-types';
jest.mock('../../../src/utils/swipe-utils', () => ({
  findNextAvailableProfile: jest.fn(),
  getSwipedUserIds: jest.fn(),
}));

jest.mock('../../../src/utils/swipe-helpers-advanced', () => ({
  handleExistingSwipe: jest.fn(),
  handleNewLike: jest.fn(),
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
import { findNextAvailableProfile, getSwipedUserIds } from '../../../src/utils/swipe-utils';
import { handleExistingSwipe, handleNewLike } from '../../../src/utils/swipe-helpers-advanced';
describe('Swipe Success Cases', () => {
  const mockSwiperId = '68b167c8157950cc7b98164a';
  const mockTargetId = '68b167c8157950cc7b98164b';
  const mockNextProfileId = '68b167c8157950cc7b98164c';
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
    (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
    (findNextAvailableProfile as jest.Mock).mockResolvedValue({
      userId: mockNextProfileId,
      name: 'Next User',
      images: ['image1.jpg'],
      profession: 'Developer',
    });
    (handleNewLike as jest.Mock).mockResolvedValue({
      type: 'LIKE_ADDED',
      message: 'Like added successfully'
    });
    const result = await swipe(null, { input: mockInput });
    expect(result).toEqual({
      success: true,
      message: 'Successfully liked profile',
      response: 'MATCH_CREATED',
      match: {
        type: 'LIKE_ADDED',
        message: 'Like added successfully'
      },
      nextProfile: {
        userId: mockNextProfileId,
        name: 'Next User',
        images: ['image1.jpg'],
        profession: 'Developer',
      },
      updatedProfiles: {
        swiperProfile: {
          id: mockSwiperId,
          userId: mockSwiperId,
          likes: [],
          matches: []
        },
        targetProfile: {
          id: mockTargetId,
          userId: mockTargetId,
          likes: [],
          matches: []
        }
      }});
    expect(Swipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        swiperId: new Types.ObjectId(mockSwiperId),
        targetId: new Types.ObjectId(mockTargetId),
        action: 'LIKE',}));});
  it('should create a match when mutual like exists', async () => {
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(null);
    (Swipe.create as jest.Mock).mockResolvedValue({});
    (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
    (findNextAvailableProfile as jest.Mock).mockResolvedValue({
      userId: mockNextProfileId,
      name: 'Next User',
      images: ['image1.jpg'],
      profession: 'Developer',});
    (handleNewLike as jest.Mock).mockResolvedValue({
      type: 'MATCH_CREATED',
      profiles: {
        swiperProfile: { _id: mockSwiperId, name: 'Swiper' },
        targetProfile: { _id: mockTargetId, name: 'Target' }}});
    const result = await swipe(null, { input: mockInput });
    expect(result.response).toBe('MATCH_CREATED');
    expect(handleNewLike).toHaveBeenCalledWith(
      new Types.ObjectId(mockSwiperId),
      new Types.ObjectId(mockTargetId));});
  it('should handle existing swipe case', async () => {
    const existingSwipe = { action: 'LIKE' };
    (User.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockSwiperId })
      .mockResolvedValueOnce({ _id: mockTargetId });
    (Swipe.findOne as jest.Mock).mockResolvedValue(existingSwipe);
    (handleExistingSwipe as jest.Mock).mockResolvedValue({
      type: 'ALREADY_SWIPED',
      existingSwipe
    });
    const result = await swipe(null, { input: mockInput });
    expect(result.response).toBe('ALREADY_SWIPED');
    expect(handleExistingSwipe).toHaveBeenCalledWith(
      existingSwipe,
      new Types.ObjectId(mockSwiperId),
      new Types.ObjectId(mockTargetId));});
  it('should handle non-LIKE actions without creating a match', async () => {
    const actions = ['DISLIKE', 'SUPER_LIKE'] as const;
    for (const action of actions) {
      const actionInput: SwipeInput = { ...mockInput, action };
      (User.findById as jest.Mock)
        .mockResolvedValueOnce({ _id: mockSwiperId })
        .mockResolvedValueOnce({ _id: mockTargetId });
      (Swipe.findOne as jest.Mock).mockResolvedValue(null);
      (Swipe.create as jest.Mock).mockResolvedValue({});
      (getSwipedUserIds as jest.Mock).mockResolvedValue([new Types.ObjectId(mockSwiperId), new Types.ObjectId(mockTargetId)]);
      (findNextAvailableProfile as jest.Mock).mockResolvedValue({
        userId: mockNextProfileId,
        name: 'Next User',
        images: ['image1.jpg'],
        profession: 'Developer',
      });
      const result = await swipe(null, { input: actionInput });
      expect(result.success).toBe(true);
      expect(result.response).toBe('SUCCESS');
      expect(result.match).toBeNull();
      expect(Swipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action,}));
      jest.clearAllMocks();}});});