import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Matchmodel, swipeModel } from '../../../../src/models';
import { swipeUser } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/swipe/swipe.model', () => ({
  swipeModel: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('../../../../src/models/tinderchat/match.model', () => ({
  Matchmodel: {
    create: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('mutation of swipe', () => {
  const mockUserId = '1234';
  const mockSwipedUser = '4567';
  const mockInfo = {} as GraphQLResolveInfo;
  const mockInput = {
    swipedUser: mockSwipedUser,
    type: 'disliked',
  };

  it('should successfully swiped but did not match', async () => {
    const user = {
      swipedUser: mockSwipedUser,
      swiperUser: mockUserId,
      type: 'disliked',
    };

    (swipeModel.create as jest.Mock).mockResolvedValue(user);
    const res = await swipeUser!({}, { input: mockInput }, { userId: mockUserId }, mockInfo);
    expect(res).toEqual({
      swiped:'successful',
      matched:false,
      matchedWith:'none',
    });
  });

  it('should successfully swiped and matched', async () => {
    const user = {
      swipedUser: mockSwipedUser,
      swiperUser: mockUserId,
      type:'liked',
    };
    const mockUser = {
      swipedUser: mockUserId,
      swiperUser: mockSwipedUser,
      type: 'liked',
    };
    const match = {
      user1: mockUserId,
      user2: mockSwipedUser,
      matched: true,
    };
    (swipeModel.create as jest.Mock).mockResolvedValue(user);
    (swipeModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Matchmodel.create as jest.Mock).mockResolvedValue(match);
    const res = await swipeUser!({}, { input: user }, { userId: mockUserId }, mockInfo);
    expect(res).toEqual({
      matchedWith: mockSwipedUser,
      swiped: 'successful',
      matched: true,
    });
  });

  it('should successfully swiped and matched', async () => {
    const user = {
      swipedUser: mockSwipedUser,
      swiperUser: mockUserId,
      type:'liked',
    };
  
    (swipeModel.create as jest.Mock).mockResolvedValue(user);
    (swipeModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await swipeUser!({}, { input: user }, { userId: mockUserId }, mockInfo);
    expect(res).toEqual({
      matchedWith:'4567',
      swiped:'successful',
      matched:false,
    }
);
  });

  it('should successfully swiped and matched', async () => {
    const user = {
      swipedUser: mockSwipedUser,
      swiperUser: mockUserId,
      type:'liked',
    };

    (swipeModel.create as jest.Mock).mockResolvedValue(user);
    (swipeModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await swipeUser!({}, { input: user }, { userId: mockUserId }, mockInfo);
    expect(res).toEqual({
      matchedWith:'4567',
      swiped:'successful',
      matched:false,
    }
);
  });


  it('should throw error when database error occured ', async () => {
    (swipeModel.create as jest.Mock).mockRejectedValue(null);
    await expect(swipeUser!({}, { input: mockInput }, { userId: mockUserId }, mockInfo)).rejects.toThrowError(GraphQLError);
    await expect(swipeUser!({}, { input: mockInput }, { userId: mockUserId }, mockInfo)).rejects.toThrowError('Database error occured');
  });
  
});
