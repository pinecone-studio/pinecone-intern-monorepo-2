import { Types } from 'mongoose';
import { swipe, undoLastSwipe } from 'src/resolvers/mutations/swipe-mutation';
import { Swipe as SwipeModel, Match as MatchModel, Profile as ProfileModel, User as UserModel } from 'src/models';
import { GraphQLResolveInfo } from 'graphql';
import { SwipeAction, SwipeResponse } from 'src/generated';

jest.mock('src/models', () => ({
  Swipe: { findOne: jest.fn(), create: jest.fn(), findByIdAndDelete: jest.fn(), find: jest.fn().mockReturnValue({ distinct: jest.fn().mockResolvedValue([]) }) },
  Match: { create: jest.fn() },
  Profile: { findOne: jest.fn() },
  User: { findById: jest.fn() },
}));

const mockSwipeModel = SwipeModel as jest.Mocked<typeof SwipeModel>;
const mockMatchModel = MatchModel as jest.Mocked<typeof MatchModel>;
const mockProfileModel = ProfileModel as jest.Mocked<typeof ProfileModel>;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

type MockFunction = (_parent: unknown, _args: Record<string, unknown>, _ctx: unknown, _info: GraphQLResolveInfo) => Promise<unknown>;
type SwipeResult = { success: boolean; message: string; response: SwipeResponse; match?: unknown; nextProfile?: unknown };

const createMockInfo = (): GraphQLResolveInfo => ({} as GraphQLResolveInfo);
const createMockUser = () => ({ _id: new Types.ObjectId(), email: 'test@example.com' });
const createMockProfile = () => ({ _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: 'Test' });
const createMockSwipe = (swiperId: string, targetId: string, action: SwipeAction) => ({ _id: new Types.ObjectId(), swiperId, targetId, action });

describe('Swipe Mutation Resolvers - Success Cases', () => {
  const mockContext = {};
  const validSwiperId = new Types.ObjectId().toHexString();
  const validTargetId = new Types.ObjectId().toHexString();
  const input = { swiperId: validSwiperId, targetId: validTargetId, action: SwipeAction.Like };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserModel.findById.mockResolvedValue(createMockUser());
    mockSwipeModel.findOne.mockResolvedValue(null);
    mockProfileModel.findOne.mockResolvedValue(createMockProfile());
    mockSwipeModel.find.mockReturnValue({ distinct: jest.fn().mockResolvedValue([]) } as unknown as ReturnType<typeof SwipeModel.find>);
  });

  describe('swipe', () => {
    const mockInfo = createMockInfo();
    const swipeFn = swipe as unknown as MockFunction;

    test('successful like swipe', async () => {
      const mockSwipe = createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like);
      mockSwipeModel.create.mockResolvedValue(mockSwipe as unknown as ReturnType<typeof SwipeModel.create>);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result).toEqual(expect.objectContaining({ success: true, message: 'Successfully liked profile', response: SwipeResponse.Success }));
    });

    test('creates match when both users like', async () => {
      const mockReverseSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Like);
      const mockMatch = { toJSON: () => ({ _id: new Types.ObjectId().toHexString(), likeduserId: validSwiperId, matcheduserId: validTargetId }) } as unknown as ReturnType<typeof MatchModel.create>;
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockReverseSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      mockMatchModel.create.mockResolvedValue(mockMatch);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result.success).toBe(true);
      expect(result.message).toBe("It's a match! 🎉");
      expect(result.response).toBe(SwipeResponse.MatchCreated);
    });

    test('handles match creation with object without toJSON method', async () => {
      const mockReverseSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Like);
      const mockMatch = { _id: new Types.ObjectId().toHexString(), likeduserId: validSwiperId, matcheduserId: validTargetId } as unknown as ReturnType<typeof MatchModel.create>;
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockReverseSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      mockMatchModel.create.mockResolvedValue(mockMatch);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result.success).toBe(true);
      expect(result.message).toBe("It's a match! 🎉");
      expect(result.response).toBe(SwipeResponse.MatchCreated);
      expect(result.match).toEqual(mockMatch);
    });

    test('handles profile without toJSON method', async () => {
      const mockSwipe = createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like);
      const mockProfileWithoutToJSON = { _id: new Types.ObjectId(), userId: new Types.ObjectId(), name: 'Test' };
      mockSwipeModel.create.mockResolvedValue(mockSwipe as unknown as ReturnType<typeof SwipeModel.create>);
      mockProfileModel.findOne.mockResolvedValue(mockProfileWithoutToJSON as unknown as ReturnType<typeof ProfileModel.findOne>);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result.success).toBe(true);
      expect(result.nextProfile).toEqual(mockProfileWithoutToJSON);
    });

    test('handles null values in convertToGraphQLType', async () => {
      const mockSwipe = createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like);
      mockSwipeModel.create.mockResolvedValue(mockSwipe as unknown as ReturnType<typeof SwipeModel.create>);
      mockProfileModel.findOne.mockResolvedValue(null);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result.success).toBe(true);
      expect(result.nextProfile).toBeUndefined();
    });

    test('handles different swipe actions', async () => {
      const dislikeInput = { ...input, action: SwipeAction.Dislike };
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Dislike) as unknown as ReturnType<typeof SwipeModel.create>);
      const result = await swipeFn({}, { input: dislikeInput }, mockContext, mockInfo) as SwipeResult;
      expect(result).toEqual(expect.objectContaining({ success: true, message: 'Successfully disliked profile' }));

      const superLikeInput = { ...input, action: SwipeAction.SuperLike };
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.SuperLike) as unknown as ReturnType<typeof SwipeModel.create>);
      const result2 = await swipeFn({}, { input: superLikeInput }, mockContext, mockInfo) as SwipeResult;
      expect(result2).toEqual(expect.objectContaining({ success: true, message: 'Successfully super_liked profile' }));

      const mockReverseSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Like);
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockReverseSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      mockMatchModel.create.mockResolvedValue(null as unknown as ReturnType<typeof MatchModel.create>);
      const result3 = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result3.success).toBe(true);
      expect(result3.match).toBeUndefined();

      const mockDislikeSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Dislike);
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockDislikeSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      const result4 = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result4).toEqual(expect.objectContaining({ success: true, message: 'Successfully liked profile', response: SwipeResponse.Success }));
    });
  });

  describe('undoLastSwipe', () => {
    const mockInfo = createMockInfo();
    const undoLastSwipeFn = undoLastSwipe as unknown as MockFunction;

    test('successfully undoes last swipe', async () => {
      const mockSwipe = createMockSwipe(validSwiperId, 'target-id', SwipeAction.Like);
      mockSwipeModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSwipe as unknown as ReturnType<typeof SwipeModel.findOne>),
      } as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.findByIdAndDelete.mockResolvedValue(mockSwipe as unknown as ReturnType<typeof SwipeModel.findByIdAndDelete>);
      const result = await undoLastSwipeFn({}, { userId: validSwiperId }, mockContext, mockInfo);
      expect(result).toBe(SwipeResponse.Success);
      expect(mockSwipeModel.findByIdAndDelete).toHaveBeenCalledWith(mockSwipe._id);
    });
  });
});