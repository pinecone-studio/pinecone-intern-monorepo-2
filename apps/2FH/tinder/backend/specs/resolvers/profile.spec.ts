import { Types } from 'mongoose';
import { ProfileResolvers } from 'src/resolvers/profile';
import { Profile as ProfileModel } from 'src/models';

jest.mock('src/models', () => ({
  Profile: { find: jest.fn() },
}));

describe('Profile Field Resolvers', () => {
  const mockProfileFind = jest.spyOn(ProfileModel, 'find');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile.likes', () => {
    const testEmptyLikes = (parent: any, description: string) => {
      it(`should return empty array when ${description}`, async () => {
        const result = await ProfileResolvers.Profile.likes(parent);
        expect(result).toEqual([]);
        expect(mockProfileFind).not.toHaveBeenCalled();
      });
    };

    testEmptyLikes({ likes: [], matches: [] }, 'no likes');
    testEmptyLikes({ likes: null, matches: [] }, 'likes is null');
    testEmptyLikes({ matches: [] }, 'likes is undefined');

    it('should return liked profiles when likes exist', async () => {
      const mockLikes = [new Types.ObjectId(), new Types.ObjectId()];
      const parent = { likes: mockLikes, matches: [] };
      const mockProfiles = [
        {
          _id: mockLikes[0],
          userId: new Types.ObjectId(),
          name: 'User 1',
          gender: 'male',
          images: ['image1.jpg'],
          profession: 'Developer'
        },
        {
          _id: mockLikes[1],
          userId: new Types.ObjectId(),
          name: 'User 2',
          gender: 'female',
          images: ['image2.jpg'],
          profession: 'Designer'
        }
      ];
      mockProfileFind.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockProfiles)
      } as any);
      const result = await ProfileResolvers.Profile.likes(parent);
      expect(mockProfileFind).toHaveBeenCalledWith({
        userId: { $in: mockLikes }
      });
      expect(result).toEqual([
        {
          id: mockLikes[0].toString(),
          userId: mockProfiles[0].userId.toString(),
          name: 'User 1',
          gender: 'male',
          images: ['image1.jpg'],
          profession: 'Developer'
        },
        {
          id: mockLikes[1].toString(),
          userId: mockProfiles[1].userId.toString(),
          name: 'User 2',
          gender: 'female',
          images: ['image2.jpg'],
          profession: 'Designer'
        }
      ]);
    });

    it('should handle database errors gracefully', async () => {
      const mockLikes = [new Types.ObjectId()];
      const parent = { likes: mockLikes, matches: [] };
      mockProfileFind.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      } as any);
      const result = await ProfileResolvers.Profile.likes(parent);
      expect(result).toEqual([]);
    });
  });

  describe('Profile.matches', () => {
    const testEmptyMatches = (parent: any, description: string) => {
      it(`should return empty array when ${description}`, async () => {
        const result = await ProfileResolvers.Profile.matches(parent);
        expect(result).toEqual([]);
        expect(mockProfileFind).not.toHaveBeenCalled();
      });
    };

    testEmptyMatches({ matches: [] }, 'no matches');
    testEmptyMatches({ matches: null }, 'matches is null');
    testEmptyMatches({}, 'matches is undefined');

    it('should return matched profiles when matches exist', async () => {
      const mockMatches = [new Types.ObjectId(), new Types.ObjectId()];
      const parent = { likes: [], matches: mockMatches };
      const mockProfiles = [
        {
          _id: mockMatches[0],
          userId: new Types.ObjectId(),
          name: 'Match 1',
          gender: 'male',
          images: ['match1.jpg'],
          profession: 'Engineer'
        },
        {
          _id: mockMatches[1],
          userId: new Types.ObjectId(),
          name: 'Match 2',
          gender: 'female',
          images: ['match2.jpg'],
          profession: 'Artist'
        }
      ];
      mockProfileFind.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockProfiles)
      } as any);
      const result = await ProfileResolvers.Profile.matches(parent);
      expect(mockProfileFind).toHaveBeenCalledWith({
        userId: { $in: mockMatches }
      });
      expect(result).toEqual([
        {
          id: mockMatches[0].toString(),
          userId: mockProfiles[0].userId.toString(),
          name: 'Match 1',
          gender: 'male',
          images: ['match1.jpg'],
          profession: 'Engineer'
        },
        {
          id: mockMatches[1].toString(),
          userId: mockProfiles[1].userId.toString(),
          name: 'Match 2',
          gender: 'female',
          images: ['match2.jpg'],
          profession: 'Artist'
        }
      ]);
    });

    it('should handle database errors gracefully', async () => {
      const mockMatches = [new Types.ObjectId()];
      const parent = { likes: [], matches: mockMatches };
      mockProfileFind.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      } as any);
      const result = await ProfileResolvers.Profile.matches(parent);
      expect(result).toEqual([]);
    });
  });
});