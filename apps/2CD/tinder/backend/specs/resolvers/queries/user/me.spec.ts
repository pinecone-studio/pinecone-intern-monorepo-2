import { me } from '../../../../src/resolvers/queries/user/me';
import User from '../../../../src/models/user';
import { Profile } from '../../../../src/models/profile';
import Match from '../../../../src/models/match';
import Like from '../../../../src/models/like';
import Message from '../../../../src/models/message';

// Mock all models
jest.mock('../../../../src/models/user', () => ({
  findOne: jest.fn()
}));

jest.mock('../../../../src/models/profile', () => ({
  Profile: {
    findOne: jest.fn()
  }
}));

jest.mock('../../../../src/models/match', () => ({
  find: jest.fn()
}));

jest.mock('../../../../src/models/like', () => ({
  find: jest.fn()
}));

jest.mock('../../../../src/models/message', () => ({
  find: jest.fn()
}));

describe('me resolver', () => {
  const mockUser = {
    _id: '1',
    clerkId: 'clerk1',
    name: 'User One',
    email: 'user1@example.com',
    toObject: () => ({
      _id: '1',
      clerkId: 'clerk1',
      name: 'User One',
      email: 'user1@example.com'
    })
  };

  const mockProfile = {
    userId: '1',
    bio: 'Bio 1',
    age: 25
  };

  const mockMatches = [
    { _id: 'match1', users: [{ _id: '1' }, { _id: '2' }] }
  ];

  const mockLikesFrom = [
    { _id: 'like1', from: '1', to: { _id: '2', name: 'User Two' } }
  ];

  const mockLikesTo = [
    { _id: 'like2', from: { _id: '2', name: 'User Two' }, to: '1' }
  ];

  const mockMessages = [
    { _id: 'msg1', sender: '1', content: 'Hello' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    
    (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);
    
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMatches)
    });
    
    (Like.find as jest.Mock).mockImplementation((query) => {
      if (query.from === '1') {
        return {
          populate: jest.fn().mockResolvedValue(mockLikesFrom)
        };
      } else if (query.to === '1') {
        return {
          populate: jest.fn().mockResolvedValue(mockLikesTo)
        };
      }
      return {
        populate: jest.fn().mockResolvedValue([])
      };
    });
    
    const mockPopulate = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockMessages)
    });
    (Message.find as jest.Mock).mockReturnValue({
      populate: mockPopulate
    });
  });

  it('should return user with all related data when found by clerkId', async () => {
    const result = await me(null, { clerkId: 'clerk1' });

    expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'clerk1' });
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: '1' });
    expect(Match.find).toHaveBeenCalledWith({ users: '1' });
    expect(Like.find).toHaveBeenCalledWith({ from: '1' });
    expect(Like.find).toHaveBeenCalledWith({ to: '1' });
    expect(Message.find).toHaveBeenCalledWith({ match: { $in: ['match1'] } });

    expect(result).toHaveProperty('profile', mockProfile);
    expect(result).toHaveProperty('matches', mockMatches);
    expect(result).toHaveProperty('likesFrom', mockLikesFrom);
    expect(result).toHaveProperty('likesTo', mockLikesTo);
    expect(result).toHaveProperty('messages', mockMessages);
  });

  it('should throw error if user is not found', async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(me(null, { clerkId: 'nonexistent' })).rejects.toThrow('User not found');
  });

  it('should handle missing related data', async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });
    (Like.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });
    
    const mockEmptyPopulate = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    });
    (Message.find as jest.Mock).mockReturnValue({
      populate: mockEmptyPopulate
    });

    const result = await me(null, { clerkId: 'clerk1' });

    expect(result).toHaveProperty('profile', null);
    expect(result).toHaveProperty('matches', []);
    expect(result).toHaveProperty('likesFrom', []);
    expect(result).toHaveProperty('likesTo', []);
    expect(result).toHaveProperty('messages', []);
  });
});
