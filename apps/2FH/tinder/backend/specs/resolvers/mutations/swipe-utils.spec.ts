// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-utils.spec.ts
import { Types } from 'mongoose';
import { Profile } from 'src/models';
import {
  findNextAvailableProfile,
  getSwipedUserIds,
  checkMutualLike,
  addMutualMatch,
} from '../../../src/utils/swipe-utils';

jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    distinct: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Utils', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findNextAvailableProfile', () => {
    it('should return next available profile when found', async () => {
      const excludedId = new Types.ObjectId('507f1f77bcf86cd799439011');
      const mockProfile = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        name: 'Test User',
        gender: 'MALE',
        bio: 'Test bio',
        interests: ['coding'],
        profession: 'Developer',
        work: 'Tech Company',
        images: ['image1.jpg'],
        likes: [new Types.ObjectId()],
        matches: [new Types.ObjectId()],
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const result = await findNextAvailableProfile([excludedId]);

      expect(result).toBeTruthy();
      expect(Profile.findOne).toHaveBeenCalledWith({
        userId: { $nin: [excludedId] }
      });
    });

    it('should return null when no profile found', async () => {
      const excludedId = new Types.ObjectId('507f1f77bcf86cd799439012');
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await findNextAvailableProfile([excludedId]);

      expect(result).toBeNull();
      expect(Profile.findOne).toHaveBeenCalledWith({
        userId: { $nin: [excludedId] }
      });
    });
  });

  describe('getSwipedUserIds', () => {
    it('should return array of swiped user IDs', async () => {
      const mockSwipedIds = [new Types.ObjectId(), new Types.ObjectId()];
      (Profile.distinct as jest.Mock).mockResolvedValue(mockSwipedIds);

      const result = await getSwipedUserIds(mockSwiperId);

      expect(result).toEqual([...mockSwipedIds, new Types.ObjectId(mockSwiperId)]);
      expect(Profile.distinct).toHaveBeenCalledWith('userId', { swiperId: mockSwiperId });
    });
  });

  describe('checkMutualLike', () => {
    it('should return true when there is a mutual like', async () => {
      const profile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      const likedUserId = new Types.ObjectId(mockTargetId);
      
      const likedProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [new Types.ObjectId(mockSwiperId)],
        matches: [],
      };

      (Profile.findOne as jest.Mock).mockResolvedValue(likedProfile);

      const result = await checkMutualLike(profile, likedUserId);

      expect(result).toBe(true);
      expect(Profile.findOne).toHaveBeenCalledWith({ userId: likedUserId });
    });

    it('should return false when there is no mutual like', async () => {
      const profile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      const likedUserId = new Types.ObjectId(mockTargetId);
      
      const likedProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [],
        matches: [],
      };

      (Profile.findOne as jest.Mock).mockResolvedValue(likedProfile);

      const result = await checkMutualLike(profile, likedUserId);

      expect(result).toBe(false);
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

      expect(Profile.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });
  });
}); 