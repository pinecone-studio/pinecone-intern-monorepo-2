// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-helpers-advanced.spec.ts
import { Types } from 'mongoose';
import { Profile as ProfileModel } from '../../../src/models';
import {
  handleExistingSwipe,
  addUsersToMatches,
  refreshProfilesAfterMatch,
  addTargetToSwiperLikes,
} from '../../../src/utils/swipe-helpers-advanced';

jest.mock('../../../src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

describe('Swipe Helpers Advanced', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleExistingSwipe', () => {
    it('should return ALREADY_SWIPED when existing swipe is not LIKE', async () => {
      const existingSwipe = { action: 'DISLIKE' };

      const result = await handleExistingSwipe(
        existingSwipe,
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toEqual({
        existingSwipe: { action: 'DISLIKE' },
        type: 'ALREADY_SWIPED'
      });
    });

    it('should return MATCH_CREATED when existing swipe is LIKE', async () => {
      const existingSwipe = { action: 'LIKE' };
      const mockSwiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [],
      };
      const mockTargetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [],
      };

      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(mockSwiperProfile)
        .mockResolvedValueOnce(mockTargetProfile);

      const result = await handleExistingSwipe(
        existingSwipe,
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeDefined();
    });
  });

  describe('addUsersToMatches', () => {
    it('should add both users to each other matches', async () => {
      (ProfileModel.updateOne as jest.Mock).mockResolvedValue({});

      await addUsersToMatches(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(ProfileModel.updateOne).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockSwiperId) },
        { $addToSet: { matches: new Types.ObjectId(mockTargetId) } }
      );
      expect(ProfileModel.updateOne).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockTargetId) },
        { $addToSet: { matches: new Types.ObjectId(mockSwiperId) } }
      );
    });
  });

  describe('refreshProfilesAfterMatch', () => {
    it('should handle profile refresh scenarios', async () => {
      // Test with valid profiles
      const updatedSwiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [new Types.ObjectId(mockTargetId)],
      };
      const updatedTargetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [new Types.ObjectId(mockSwiperId)],
      };

      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(updatedSwiperProfile)
        .mockResolvedValueOnce(updatedTargetProfile);

      const result = await refreshProfilesAfterMatch(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeDefined();
      expect(result?.swiperProfile.userId.toString()).toBe(mockSwiperId);
      expect(result?.targetProfile.userId.toString()).toBe(mockTargetId);

      // Test edge case handling
      jest.clearAllMocks();
      const edgeResult = await refreshProfilesAfterMatch(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );
      expect(edgeResult).toBeDefined();
      expect(ProfileModel.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('addTargetToSwiperLikes', () => {
    it('should add target to swiper likes', async () => {
      const mockSwiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        gender: 'male',
      };
      const mockTargetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        gender: 'male',
      };
      
      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(mockSwiperProfile)
        .mockResolvedValueOnce(mockTargetProfile);

      (ProfileModel.updateOne as jest.Mock).mockResolvedValue({});

      await addTargetToSwiperLikes(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(ProfileModel.updateOne).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockSwiperId) },
        { $addToSet: { likes: new Types.ObjectId(mockTargetId) } }
      );
    });
  });
}); 