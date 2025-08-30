// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-helpers.spec.ts
// Integration tests for core swipe helper functions

import { Types } from 'mongoose';
import { Profile as ProfileModel } from '../../../src/models';
import {
  syncExistingMatches,
  createMatchObject,
  checkIfMatched,
  checkProfilesAndMatch,
  processLikeForMutualMatch,
} from '../../../src/utils/swipe-helpers';
jest.mock('../../../src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));
describe('Swipe Helpers Core', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('syncExistingMatches', () => {
    it('should sync existing matches for user', async () => {
      const mockProfile = {
        userId: mockSwiperId,
        likes: [new Types.ObjectId(mockTargetId)],
      };

      (ProfileModel.findOne as jest.Mock).mockResolvedValue(mockProfile);

      await syncExistingMatches(mockSwiperId);

      expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: mockSwiperId });
    });

    it('should handle missing profile gracefully', async () => {
      (ProfileModel.findOne as jest.Mock).mockResolvedValue(null);

      await syncExistingMatches('nonexistent');

      expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: 'nonexistent' });
    });
  });

  describe('createMatchObject', () => {
    it('should create proper match object', () => {
      const swiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [],
      };

      const targetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [],
      };

      const result = createMatchObject(swiperProfile, targetProfile);

      expect(result.likeduserId.userId).toBe(mockSwiperId);
      expect(result.matcheduserId.userId).toBe(mockTargetId);
    });
  });

  describe('checkIfMatched', () => {
    it('should handle match scenarios correctly', () => {
      // Test mutual match
      const swiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [new Types.ObjectId(mockTargetId)],
      };
      const targetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [new Types.ObjectId(mockSwiperId)],
      };

      const matchResult = checkIfMatched(
        swiperProfile,
        targetProfile,
        new Types.ObjectId(mockTargetId),
        new Types.ObjectId(mockSwiperId)
      );
      expect(matchResult).toBe(true);

      // Test non-match
      const nonMatchResult = checkIfMatched(
        { ...swiperProfile, matches: [] },
        { ...targetProfile, matches: [] },
        new Types.ObjectId(mockTargetId),
        new Types.ObjectId(mockSwiperId)
      );
      expect(nonMatchResult).toBe(false);
    });
  });

  describe('checkProfilesAndMatch', () => {
    it('should check profiles and return match object', async () => {
      const swiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [new Types.ObjectId(mockTargetId)],
      };

      const targetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [new Types.ObjectId(mockSwiperId)],
      };

      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(swiperProfile)
        .mockResolvedValueOnce(targetProfile);

      const result = await checkProfilesAndMatch(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeDefined();
      expect(result?.likeduserId.userId).toBe(mockSwiperId);
    });
  });

  describe('processLikeForMutualMatch', () => {
    it('should process mutual like correctly', async () => {
      const profile = {
        _id: new Types.ObjectId(mockSwiperId),
        userId: mockSwiperId,
        likes: [new Types.ObjectId(mockTargetId)],
      };

      const likedProfile = {
        userId: mockTargetId,
        likes: [new Types.ObjectId(mockSwiperId)],
      };

      (ProfileModel.findOne as jest.Mock).mockResolvedValue(likedProfile);

      const result = await processLikeForMutualMatch(profile, new Types.ObjectId(mockTargetId));

      expect(result).toBe(true);
    });
  });
}); 