import { getSwipeHistory, getNextProfile, getSwipedProfiles } from 'src/resolvers/queries/swipe-queries';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

jest.mock('src/models', () => ({
  Swipe: { find: jest.fn(), distinct: jest.fn() },
  Profile: { findOne: jest.fn(), find: jest.fn() },
  User: { findById: jest.fn() },
}));

import { Swipe, Profile } from 'src/models';

describe('Swipe Query Resolvers', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockObjectId = new Types.ObjectId(mockUserId);
  const mockSwipeData = {
    _id: new Types.ObjectId(),
    swiperId: mockObjectId,
    targetId: { _id: new Types.ObjectId(), name: 'Test User', images: ['image1.jpg'], profession: 'Developer' },
    action: 'LIKE' as const,
    swipedAt: new Date(),
    createdAt: new Date()
  };
  const mockProfileData = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    name: 'Test Profile',
    profession: 'Developer',
    images: ['profile1.jpg']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
  });

  describe('getSwipeHistory', () => {
    it('should return swipe history successfully', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([mockSwipeData])
        })
      });
      const result = await getSwipeHistory(null, { userId: mockUserId }, null, null);
      expect(result).toEqual([{
        id: mockSwipeData._id.toString(),
        swiperId: mockSwipeData.swiperId.toString(),
        targetId: mockSwipeData.targetId._id.toString(),
        action: mockSwipeData.action,
        swipedAt: mockSwipeData.swipedAt
      }]);
    });

    it('should throw error for invalid user ID', async () => {
      Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
      await expect(getSwipeHistory(null, { userId: 'invalid-id' }, null, null))
        .rejects.toThrow(GraphQLError);
    });

    it('should handle database errors and empty results', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });
      await expect(getSwipeHistory(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);

      (Swipe.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue('String error')
        })
      });
      await expect(getSwipeHistory(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);

      (Swipe.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([])
        })
      });
      const result = await getSwipeHistory(null, { userId: mockUserId }, null, null);
      expect(result).toEqual([]);
    });
  });

  describe('getNextProfile', () => {
    it('should return next available profile', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        distinct: jest.fn().mockResolvedValue([new Types.ObjectId()])
      });
      (Profile.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProfileData)
      });
      const result = await getNextProfile(null, { userId: mockUserId }, null, null);
      expect(result).toEqual(mockProfileData);
    });

    it('should throw error for invalid user ID', async () => {
      Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
      await expect(getNextProfile(null, { userId: 'invalid-id' }, null, null))
        .rejects.toThrow(GraphQLError);
    });

    it('should handle database errors and edge cases', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        distinct: jest.fn().mockRejectedValue(new Error('Database error'))
      });
      await expect(getNextProfile(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);

      (Swipe.find as jest.Mock).mockReturnValue({
        distinct: jest.fn().mockRejectedValue('String error')
      });
      await expect(getNextProfile(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);

      (Swipe.find as jest.Mock).mockReturnValue({
        distinct: jest.fn().mockResolvedValue([])
      });
      (Profile.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      const result = await getNextProfile(null, { userId: mockUserId }, null, null);
      expect(result).toBeNull();
    });
  });

  describe('getSwipedProfiles', () => {
    it('should return swiped profiles successfully', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ targetId: { _id: new Types.ObjectId() } }])
      });
      (Profile.find as jest.Mock).mockResolvedValue([mockProfileData]);
      const result = await getSwipedProfiles(null, { userId: mockUserId }, null, null);
      expect(result).toEqual([mockProfileData]);
    });

    it('should throw error for invalid user ID', async () => {
      Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
      await expect(getSwipedProfiles(null, { userId: 'invalid-id' }, null, null))
        .rejects.toThrow(GraphQLError);
    });

    it('should handle database errors', async () => {
      (Swipe.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });
      await expect(getSwipedProfiles(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);

      (Swipe.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue('String error')
      });
      await expect(getSwipedProfiles(null, { userId: mockUserId }, null, null))
        .rejects.toThrow(GraphQLError);
    });
  });
}); 