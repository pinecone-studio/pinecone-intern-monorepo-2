import { getAllUsers } from '../../../../src/resolvers/queries/user/get-all-users';
import User from '../../../../src/models/user';
import { Profile } from '../../../../src/models/profile';
import Match from '../../../../src/models/match';
import Like from '../../../../src/models/like';
import Message from '../../../../src/models/message';

jest.mock('../../../../src/models/user');
jest.mock('../../../../src/models/profile');
jest.mock('../../../../src/models/match');
jest.mock('../../../../src/models/like');
jest.mock('../../../../src/models/message');

describe('getAllUsers', () => {
  const mockUsers = [
    { _id: '1', clerkId: 'clerk1', name: 'User One', email: 'user1@example.com', toObject: () => ({ _id: '1', clerkId: 'clerk1', name: 'User One', email: 'user1@example.com' }) },
    { _id: '2', clerkId: 'clerk2', name: 'User Two', email: 'user2@example.com', toObject: () => ({ _id: '2', clerkId: 'clerk2', name: 'User Two', email: 'user2@example.com' }) },
  ];

  const mockProfiles = [
    { userId: '1', bio: 'Bio 1', age: 25 },
    { userId: '2', bio: 'Bio 2', age: 30 },
  ];

  const mockMatches = [
    { _id: 'match1', users: [{ _id: '1' }, { _id: '2' }] },
  ];

  const mockLikesFrom = [
    { _id: 'like1', from: '1', to: { _id: '2', name: 'User Two' } },
  ];

  const mockLikesTo = [
    { _id: 'like2', from: { _id: '2', name: 'User Two' }, to: '1' },
  ];

  const mockMessages = [
    { _id: 'msg1', sender: '1', content: 'Hello' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (User.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUsers),
    });
    
    (Profile.find as jest.Mock).mockResolvedValue(mockProfiles);
    
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMatches),
    });
    
    (Like.find as jest.Mock).mockImplementation((query) => {
      if (query.from) {
        return {
          populate: jest.fn().mockResolvedValue(mockLikesFrom),
        };
      } else if (query.to) {
        return {
          populate: jest.fn().mockResolvedValue(mockLikesTo),
        };
      }
      return {
        populate: jest.fn().mockResolvedValue([]),
      };
    });
    
    (Message.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMessages),
    });
  });

  it('should return users with their related data', async () => {
    const result = await getAllUsers();

    expect(User.find).toHaveBeenCalled();
    expect(Profile.find).toHaveBeenCalledWith({ userId: { $in: ['1', '2'] } });
    expect(Match.find).toHaveBeenCalledWith({ users: { $in: ['1', '2'] } });
    expect(Like.find).toHaveBeenCalledWith({ from: { $in: ['1', '2'] } });
    expect(Like.find).toHaveBeenCalledWith({ to: { $in: ['1', '2'] } });
    expect(Message.find).toHaveBeenCalledWith({ sender: { $in: ['1', '2'] } });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('profile', mockProfiles[0]);
    expect(result[0]).toHaveProperty('matches', mockMatches);
    expect(result[0]).toHaveProperty('likesFrom', mockLikesFrom);
    expect(result[0]).toHaveProperty('likesTo', mockLikesTo);
    expect(result[0]).toHaveProperty('messages', mockMessages);
  });

  it('should handle empty related data', async () => {
    (Profile.find as jest.Mock).mockResolvedValue([]);
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });
    (Like.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });
    (Message.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    const result = await getAllUsers();

    expect(result).toHaveLength(2);
    expect(result[0].profile).toBeNull();
    expect(result[0].matches).toEqual([]);
    expect(result[0].likesFrom).toEqual([]);
    expect(result[0].likesTo).toEqual([]);
    expect(result[0].messages).toEqual([]);
  });

  it('should throw error when DB fails', async () => {
    (User.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('DB failure')),
    });

    await expect(getAllUsers()).rejects.toThrow('DB failure');
  });
});
