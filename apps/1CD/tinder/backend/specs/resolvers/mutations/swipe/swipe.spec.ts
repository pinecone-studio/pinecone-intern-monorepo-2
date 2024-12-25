import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { swipeModel } from '../../../../src/models';
import { swipeUser } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/swipe/swipe.model', () => ({
    swipeModel:{
        create: jest.fn(),
    }

}));

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('mutation of swipe', () => {
  const mockUserId = '1234';
  const mockSwipedUser = '4567';
  const mockInfo = {} as GraphQLResolveInfo;
  const mockInput = {
    swipedUser: mockSwipedUser,
    type: 'liked',
  };
  
  it('should successfully swipe ', async () => {
    const user={
        swipedUser:mockSwipedUser,
        swiperUser:mockUserId,
        type:'liked'
    };
    (swipeModel.create as jest.Mock).mockResolvedValue(user);
    const res = await swipeUser!({}, { input:mockInput }, { userId: mockUserId }, mockInfo);
    expect(res).toBe('Success');
  });
  it('should throw error when database error occured ',async()=>{
    (swipeModel.create as jest.Mock).mockRejectedValue(null);
    await expect(swipeUser!({}, {input:mockInput}, { userId: mockUserId }, mockInfo)).rejects.toThrowError(GraphQLError);
    await expect(swipeUser!({}, {input:mockInput}, { userId: mockUserId }, mockInfo)).rejects.toThrowError('Database error occured');
  })
});
