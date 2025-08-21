// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-helpers-core.spec.ts
import { Types } from 'mongoose';
import { Profile as ProfileModel, Swipe } from 'src/models';
import {
  getSwipedUserIds,
  findNextAvailableProfile,
  syncExistingMatches,
  createMatchObject,
  checkIfMatched,
  checkProfilesAndMatch,
} from '../../../src/utils/swipe-helpers';

jest.mock('src/models', () => ({
  Swipe: {
    find: jest.fn(),
    distinct: jest.fn(),
  },
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Helpers Core', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSwipedUserIds', () => {
    it('should return list of swiped user IDs including the user themselves', async () => {
      const mockSwipedIds = [new Types.ObjectId(mockTargetId)];
      (Swipe.find as jest.Mock).mockReturnValue({
        distinct: jest.fn().mockResolvedValue(mockSwipedIds),
      });

      const result = await getSwipedUserIds(mockSwiperId);

      expect(result).toEqual(expect.arrayContaining([new Types.ObjectId(mockTargetId), new Types.ObjectId(mockSwiperId)]));
      expect(Swipe.find).toHaveBeenCalledWith({ swiperId: mockSwiperId });
    });
  });

  describe('findNextAvailableProfile', () => {
    it('should return next available profile', async () => {
      const mockProfile = {
        userId: new Types.ObjectId(),
        name: 'Next User',
        images: ['image1.jpg'],
        profession: 'Developer',
        likes: [],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const result = await findNextAvailableProfile([new Types.ObjectId()]);

      expect(result).toEqual({
        userId: mockProfile.userId.toString(),
        name: mockProfile.name,
        images: mockProfile.images,
        profession: mockProfile.profession,
      });
    });
  });

  describe('syncExistingMatches', () => {
    it('should process likes for mutual matches', async () => {
      const mockProfile = {
        userId: mockSwiperId,
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      (ProfileModel.findOne as jest.Mock).mockResolvedValue(mockProfile);

      await syncExistingMatches(mockSwiperId);

      expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: mockSwiperId });
    });
  });

  describe('createMatchObject', () => {
    it('should create match object with correct structure', () => {
      const swiperProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [new Types.ObjectId(mockTargetId)],
        matches: [],
      };
      const targetProfile = {
        userId: new Types.ObjectId(mockTargetId),
        name: 'Target',
        likes: [new Types.ObjectId(mockSwiperId)],
        matches: [],
      };

      const result = createMatchObject(swiperProfile, targetProfile);

      expect(result.likeduserId.userId).toBe(mockSwiperId);
      expect(result.matcheduserId.userId).toBe(mockTargetId);
    });
  });

  describe('checkIfMatched', () => {
    it('should return true when profiles are matched', () => {
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

      const result = checkIfMatched(
        swiperProfile,
        targetProfile,
        new Types.ObjectId(mockTargetId),
        new Types.ObjectId(mockSwiperId)
      );

      expect(result).toBe(true);
    });
  });

  describe('checkProfilesAndMatch', () => {
    it('should return match object when profiles exist and match', async () => {
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
    });
  });
}); 