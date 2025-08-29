// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-helpers.spec.ts
// This file has been split into multiple smaller test files to reduce complexity
// See: swipe-helpers-core.spec.ts and swipe-helpers-advanced.spec.ts

import { Types } from 'mongoose';
import { Profile as ProfileModel } from 'src/models';
import {
  handleExistingSwipe,
  addUsersToMatches,
  refreshProfilesAfterMatch,
} from '../../../src/utils/swipe-helpers';

jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('Swipe Helpers Integration', () => {
  const mockSwiperId = new Types.ObjectId().toString();
  const mockTargetId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Integration Tests', () => {
    it('should handle complete swipe flow', async () => {
      const existingSwipe = { action: 'LIKE' };
      
      const result = await handleExistingSwipe(
        existingSwipe,
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeDefined();
    });

    it('should add users to matches correctly', async () => {
      await addUsersToMatches(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });

    it('should refresh profiles after match', async () => {
      const mockProfile = {
        userId: new Types.ObjectId(mockSwiperId),
        name: 'Swiper',
        likes: [],
        matches: [new Types.ObjectId(mockTargetId)],
      };

      (ProfileModel.findOne as jest.Mock)
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockProfile);

      const result = await refreshProfilesAfterMatch(
        new Types.ObjectId(mockSwiperId),
        new Types.ObjectId(mockTargetId)
      );

      expect(result).toBeDefined();
    });
  });
}); 