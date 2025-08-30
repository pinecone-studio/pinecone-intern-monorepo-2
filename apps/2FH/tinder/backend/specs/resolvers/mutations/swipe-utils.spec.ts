// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-utils.spec.ts
import { Types } from 'mongoose';

// Mock the models before importing the functions
jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    distinct: jest.fn(),
  },
  Swipe: {
    find: jest.fn(),
  },
}));

// Now import the functions after mocking
import { Profile, Swipe } from 'src/models';
import { findNextAvailableProfile, getSwipedUserIds, checkMutualLike, addMutualMatch } from 'src/utils/swipe-utils';

describe('Swipe Utils', () => {
  const mockSwiperId = '507f1f77bcf86cd799439011';
  const mockTargetId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findNextAvailableProfile', () => {
    it('should handle profile finding scenarios', async () => {
      const excludedId = new Types.ObjectId('507f1f77bcf86cd799439011');
      const mockProfile = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        userId: new Types.ObjectId('507f1f77bcf86cd799439012'),
        name: 'Next User',
        gender: 'female',
        bio: 'Next User Bio',
        interests: ['coding', 'music'],
        profession: 'Developer',
        work: 'Tech Corp',
        images: ['image1.jpg'],
        likes: [new Types.ObjectId()],
        matches: [new Types.ObjectId()],
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Test profile found
      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);
      const foundResult = await findNextAvailableProfile([excludedId]);
      expect(foundResult).toBeTruthy();
      expect(Profile.findOne).toHaveBeenCalledWith({
        _id: { $nin: [excludedId] }
      });

      // Test no profile found
      jest.clearAllMocks();
      (Profile.findOne as jest.Mock).mockResolvedValue(null);
      const notFoundResult = await findNextAvailableProfile([excludedId]);
      expect(notFoundResult).toBeNull();
      expect(Profile.findOne).toHaveBeenCalledWith({
        _id: { $nin: [excludedId] }
      });
    });
  });

  describe('getSwipedUserIds', () => {
    it('should return array of swiped user IDs', async () => {
      const mockSwipedProfiles = [
        { targetId: new Types.ObjectId('507f1f77bcf86cd799439013') },
        { targetId: new Types.ObjectId('507f1f77bcf86cd799439014') }
      ];
      const mockSwiperProfile = { _id: new Types.ObjectId('507f1f77bcf86cd799439015') };
      
      (Swipe.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockSwipedProfiles)
      });
      (Profile.findOne as jest.Mock).mockResolvedValue(mockSwiperProfile);

      const result = await getSwipedUserIds(mockSwiperId);

      expect(result).toEqual([
        new Types.ObjectId('507f1f77bcf86cd799439013'),
        new Types.ObjectId('507f1f77bcf86cd799439014'),
        new Types.ObjectId('507f1f77bcf86cd799439015')
      ]);
      expect(Swipe.find).toHaveBeenCalledWith({ 
        swiperId: new Types.ObjectId(mockSwiperId) 
      });
    });

    it('should handle case when swiper profile not found', async () => {
      const mockSwipedProfiles = [
        { targetId: new Types.ObjectId('507f1f77bcf86cd799439013') }
      ];
      (Swipe.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockSwipedProfiles)
      });
      (Profile.findOne as jest.Mock).mockResolvedValue(null);
      const result = await getSwipedUserIds(mockSwiperId);
      expect(result).toEqual([
        new Types.ObjectId('507f1f77bcf86cd799439013')
      ]);
    });
  });
  describe('checkMutualLike', () => {
    it('should handle mutual like scenarios correctly', async () => {
      const profile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      const likedUserId = new Types.ObjectId(mockTargetId);
      const likedProfileWithLike = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [new Types.ObjectId(mockSwiperId)],
        matches: [],
      };
      (Profile.findOne as jest.Mock).mockResolvedValue(likedProfileWithLike);
      const mutualResult = await checkMutualLike(profile, likedUserId);
      expect(mutualResult).toBe(true);
      expect(Profile.findOne).toHaveBeenCalledWith({ userId: likedUserId });
      jest.clearAllMocks();
      const likedProfileWithoutLike = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [],
      };
      (Profile.findOne as jest.Mock).mockResolvedValue(likedProfileWithoutLike);
      const noMutualResult = await checkMutualLike(profile, likedUserId);
      expect(noMutualResult).toBe(false);
      expect(Profile.findOne).toHaveBeenCalledWith({ userId: likedUserId });
    });
  });
  describe('addMutualMatch', () => {
    it('should add both users to each other matches', async () => {
      const profile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      const likedUserId = new Types.ObjectId(mockTargetId);
      (Profile.findOneAndUpdate as jest.Mock).mockResolvedValue({});
      await addMutualMatch(profile, likedUserId);
      expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: profile.userId },
        { $addToSet: { matches: likedUserId } }
      );
      expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: likedUserId },
        { $addToSet: { matches: profile.userId } }
      );
    });
  });
}); 