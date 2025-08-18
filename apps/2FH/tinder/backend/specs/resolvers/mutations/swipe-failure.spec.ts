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

describe('Swipe Mutation Resolvers - Failure Cases', () => {
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

    test('handles already swiped', async () => {
      mockSwipeModel.findOne.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.findOne>);
      const result = await swipeFn({}, { input }, mockContext, mockInfo) as SwipeResult;
      expect(result).toEqual(expect.objectContaining({ success: false, message: 'Already swiped on this profile', response: SwipeResponse.AlreadySwiped }));
    });

    test('throws for invalid user ID', async () => {
      await expect(swipeFn({}, { input: { ...input, swiperId: 'invalid' } }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Invalid user ID format');
    });

    test('throws for same user ID', async () => {
      await expect(swipeFn({}, { input: { ...input, targetId: validSwiperId } }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Cannot swipe on your own profile');
    });

    test('throws when users not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);
      await expect(swipeFn({}, { input }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: One or both users not found');
    });

    test('handles match creation failure', async () => {
      const mockReverseSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Like);
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockReverseSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      mockMatchModel.create.mockRejectedValue(new Error('Match creation failed'));
      await expect(swipeFn({}, { input }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Failed to create match: Match creation failed');
    });

    test('handles non-Error match creation failure', async () => {
      const mockReverseSwipe = createMockSwipe(validTargetId, validSwiperId, SwipeAction.Like);
      mockSwipeModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockReverseSwipe as unknown as ReturnType<typeof SwipeModel.findOne>);
      mockSwipeModel.create.mockResolvedValue(createMockSwipe(validSwiperId, validTargetId, SwipeAction.Like) as unknown as ReturnType<typeof SwipeModel.create>);
      mockMatchModel.create.mockRejectedValue('String error');
      await expect(swipeFn({}, { input }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Failed to create match: String error');
    });

    test('handles database error during swipe creation', async () => {
      mockSwipeModel.findOne.mockResolvedValue(null);
      mockProfileModel.findOne.mockResolvedValue(createMockProfile());
      mockSwipeModel.create.mockRejectedValue(new Error('Database error during swipe creation'));
      await expect(swipeFn({}, { input }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Database error during swipe creation');
    });

    test('handles non-Error database error during swipe creation', async () => {
      mockSwipeModel.findOne.mockResolvedValue(null);
      mockProfileModel.findOne.mockResolvedValue(createMockProfile());
      mockSwipeModel.create.mockRejectedValue('Non-Error database failure');
      await expect(swipeFn({}, { input }, mockContext, mockInfo)).rejects.toThrow('Swipe failed: Non-Error database failure');
    });
  });

  describe('undoLastSwipe', () => {
    const mockInfo = createMockInfo();
    const undoLastSwipeFn = undoLastSwipe as unknown as MockFunction;

    test('returns error when no swipe exists', async () => {
      mockSwipeModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      } as unknown as ReturnType<typeof SwipeModel.findOne>);
      const result = await undoLastSwipeFn({}, { userId: validSwiperId }, mockContext, mockInfo);
      expect(result).toBe(SwipeResponse.Error);
    });

    test('throws for invalid user ID', async () => {
      await expect(undoLastSwipeFn({}, { userId: 'invalid' }, mockContext, mockInfo)).rejects.toThrow('Failed to undo swipe: Invalid user ID format');
    });

    test('handles database errors', async () => {
      mockSwipeModel.findOne.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      } as unknown as ReturnType<typeof SwipeModel.findOne>);
      await expect(undoLastSwipeFn({}, { userId: validSwiperId }, mockContext, mockInfo)).rejects.toThrow('Failed to undo swipe: Database connection failed');

      mockSwipeModel.findOne.mockReturnValue({
        sort: jest.fn().mockRejectedValue('String error'),
      } as unknown as ReturnType<typeof SwipeModel.findOne>);
      await expect(undoLastSwipeFn({}, { userId: validSwiperId }, mockContext, mockInfo)).rejects.toThrow('Failed to undo swipe: String error');
    });
  });
});