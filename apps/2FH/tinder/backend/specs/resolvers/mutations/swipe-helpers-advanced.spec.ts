// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-helpers-advanced.spec.ts
import { Types } from 'mongoose';
import { Profile as ProfileModel } from 'src/models';
import {
  handleExistingSwipe,
  addUsersToMatches,
  refreshProfilesAfterMatch,
  addTargetToSwiperLikes,
} from '../../../src/utils/swipe-helpers-advanced';

jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Helpers Advanced', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleExistingSwipe', () => {
    it('should return null when existing swipe is not LIKE', async () => {
      const existingSwipe = { action: 'DISLIKE' };

      const result = await handleExistingSwipe(
        existingSwipe,
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeNull();
    });
  });

  describe('addUsersToMatches', () => {
    it('should add both users to each other matches', async () => {
      await addUsersToMatches(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockSwiperId) },
        { $addToSet: { matches: new Types.ObjectId(mockTargetId) } }
      );
      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockTargetId) },
        { $addToSet: { matches: new Types.ObjectId(mockSwiperId) } }
      );
    });
  });

  describe('refreshProfilesAfterMatch', () => {
    it('should return updated match object after refreshing profiles', async () => {
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
      expect(result?.likeduserId.userId.toString()).toBe(mockSwiperId);
      expect(result?.matcheduserId.userId.toString()).toBe(mockTargetId);
    });

    it('should return null when one profile is missing after refresh', async () => {
      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({});

      const result = await refreshProfilesAfterMatch(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeNull();
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

      await addTargetToSwiperLikes(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockSwiperId) },
        { $addToSet: { likes: new Types.ObjectId(mockTargetId) } }
      );
    });
  });

}); 