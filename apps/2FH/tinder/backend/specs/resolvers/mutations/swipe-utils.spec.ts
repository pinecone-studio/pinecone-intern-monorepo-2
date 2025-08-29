// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-utils.spec.ts
import { Types } from 'mongoose';
import { ProfileModel } from 'src/models';
import { checkMutualLike, addMutualMatch, processLikeForMutualMatch } from 'src/utils/swipe-utils';
import { SwipeProfile } from '../../../src/types/swipe-types';

// Mock MongoDB models
jest.mock('src/models', () => ({
  ProfileModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Utils', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkMutualLike', () => {
    it('should return true if mutual like exists', async () => {
      const mockProfile: SwipeProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue({
        userId: mockTargetId,
        likes: [new Types.ObjectId(mockSwiperId)],
      });

      const result = await checkMutualLike(mockProfile, new Types.ObjectId(mockTargetId));

      expect(result).toBe(true);
      expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: new Types.ObjectId(mockTargetId) });
    });

    it('should return false if no mutual like exists', async () => {
      const mockProfile: SwipeProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue({
        userId: mockTargetId,
        likes: [],
      });

      const result = await checkMutualLike(mockProfile, new Types.ObjectId(mockTargetId));

      expect(result).toBe(false);
    });
  });

  describe('addMutualMatch', () => {
    it('should add mutual match to both profiles', async () => {
      const mockProfile: SwipeProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [],
      };
      (ProfileModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});

      await addMutualMatch(mockProfile, new Types.ObjectId(mockTargetId));

      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockSwiperId) },
        { $addToSet: { matches: new Types.ObjectId(mockTargetId) } },
      );
      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockTargetId) },
        { $addToSet: { matches: new Types.ObjectId(mockSwiperId) } },
      );
    });
  });

  describe('processLikeForMutualMatch', () => {
    it('should add mutual match if mutual like exists', async () => {
      const mockProfile: SwipeProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue({
        userId: mockTargetId,
        likes: [new Types.ObjectId(mockSwiperId)],
      });
      (ProfileModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});

      await processLikeForMutualMatch(mockProfile, new Types.ObjectId(mockTargetId));

      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });

    it('should not add match if no mutual like exists', async () => {
      const mockProfile: SwipeProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue({
        userId: mockTargetId,
        likes: [],
      });

      await processLikeForMutualMatch(mockProfile, new Types.ObjectId(mockTargetId));

      expect(ProfileModel.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });
});