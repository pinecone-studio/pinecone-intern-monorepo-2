import mongoose, { ClientSession } from 'mongoose';
import { GraphQLError } from 'graphql';
import { swipe } from 'src/resolvers/mutations/swipe-mutation';
import { Swipe, Profile } from 'src/models';
import { SwipeResponse, SwipeAction } from 'src/generated';
import { Context } from 'src/types';
import { NextRequest } from 'next/server';

// Mock Mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };
});

// Mock Swipe and Profile models
jest.mock('src/models', () => {
  const mockSwipeFindOne = jest.fn();
  const mockProfileFindOne = jest.fn();
  const mockSwipeConstructor = jest.fn();

  return {
    Swipe: Object.assign(mockSwipeConstructor, {
      findOne: mockSwipeFindOne,
      deleteOne: jest.fn(),
    }),
    Profile: {
      findOne: mockProfileFindOne,
    },
  };
});

// Test setup
beforeEach(() => {
  jest.clearAllMocks();
});

describe('swipe Mutation', () => {
  const mockInput = {
    swiperId: 'user1',
    targetId: 'user2',
    action: SwipeAction.Like, // Use SwipeAction enum
  };

  const mockSwiperProfile = {
    userId: 'user1',
    likes: [] as mongoose.Types.ObjectId[],
    matches: [] as mongoose.Types.ObjectId[],
    save: jest.fn().mockResolvedValue(true),
  };

  const mockTargetProfile = {
    userId: 'user2',
    likes: [] as mongoose.Types.ObjectId[],
    matches: [] as mongoose.Types.ObjectId[],
    save: jest.fn().mockResolvedValue(true),
  };

  const mockSession: any = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  const mockContext: Context = {
    req: {} as NextRequest, // Mock NextRequest
  };

  beforeEach(() => {
    (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it('should return error if swiperId equals targetId', async () => {
    const input = { ...mockInput, targetId: 'user1' };
    const result = await swipe!({}, { input }, mockContext, {} as any);

    expect(result).toEqual({
      success: false,
      message: 'Өөртөө swipe хийж болохгүй',
      response: SwipeResponse.Error,
    });
    expect(Swipe.findOne).not.toHaveBeenCalled();
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it('should return AlreadySwiped if swipe already exists', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ swiperId: 'user1', targetId: 'user2' }),
    });

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(Swipe.findOne).toHaveBeenCalledWith({ swiperId: 'user1', targetId: 'user2' });
    expect(result).toEqual({
      success: false,
      message: 'Энд хэрэглэгчийг аль хэдийн swipe хийсэн байна',
      response: SwipeResponse.AlreadySwiped,
    });
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it('should return error if swiperProfile not found', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user1' });
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user2' });
    expect(result).toEqual({
      success: false,
      message: 'Хэрэглэгч олдсонгүй',
      response: SwipeResponse.Error,
    });
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it('should return error if targetProfile not found', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) });

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user1' });
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user2' });
    expect(result).toEqual({
      success: false,
      message: 'Хэрэглэгч олдсонгүй',
      response: SwipeResponse.Error,
    });
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it('should return AlreadyMatched if users are already matched', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ ...mockSwiperProfile, matches: [new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')] }),
      })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(result).toEqual({
      success: false,
      message: 'Энд хэрэглэгчтэй аль хэдийн match болсон байна',
      response: SwipeResponse.AlreadySwiped,
    });
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it('should handle DISLIKE action successfully', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    const result = await swipe!({}, { input: { ...mockInput, action: SwipeAction.Dislike } }, mockContext, {} as any);

    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockSwiperProfile.save).not.toHaveBeenCalled();
    expect(mockTargetProfile.save).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Swipe амжилттай хийгдлээ',
      response: SwipeResponse.Success,
      match: null,
    });
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle LIKE action without match', async () => {
    (Swipe.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockTargetProfile.likes).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockTargetProfile.save).toHaveBeenCalledTimes(1);
    expect(mockSwiperProfile.save).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Swipe амжилттай хийгдлээ',
      response: SwipeResponse.Success,
      match: null,
    });
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle SUPER_LIKE action with match', async () => {
    (Swipe.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ swiperId: 'user2', targetId: 'user1', action: SwipeAction.Like }),
      });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    const result = await swipe!({}, { input: { ...mockInput, action: SwipeAction.SuperLike } }, mockContext, {} as any);

    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockTargetProfile.likes).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockSwiperProfile.matches).toContainEqual(new mongoose.Types.ObjectId('user2'));
    expect(mockTargetProfile.matches).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockTargetProfile.save).toHaveBeenCalledTimes(2);
    expect(mockSwiperProfile.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      message: 'Match боллоо!',
      response: SwipeResponse.MatchCreated,
      match: {
        likeduserId: mockSwiperProfile,
        matcheduserId: mockTargetProfile,
      },
    });
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle error when swipe save fails', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockRejectedValue(new Error('Swipe save error')) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    await expect(swipe!({}, { input: mockInput }, mockContext, {} as any)).rejects.toThrow(
      new GraphQLError('Swipe save error', { extensions: { code: 'ERROR' } })
    );
    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle error when targetProfile save fails for LIKE', async () => {
    (Swipe.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockTargetProfile,
          save: jest.fn().mockRejectedValue(new Error('Target profile save error')),
        }),
      });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    await expect(swipe!({}, { input: mockInput }, mockContext, {} as any)).rejects.toThrow(
      new GraphQLError('Target profile save error', { extensions: { code: 'ERROR' } })
    );
    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockTargetProfile.likes).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockTargetProfile.save).toHaveBeenCalled();
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle error when profile save fails during match', async () => {
    (Swipe.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ swiperId: 'user2', targetId: 'user1', action: SwipeAction.Like }),
      });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockTargetProfile,
          save: jest.fn()
            .mockResolvedValueOnce(true) // First save (likes)
            .mockRejectedValueOnce(new Error('Match save error')), // Second save (matches)
        }),
      });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    await expect(swipe!({}, { input: { ...mockInput, action: SwipeAction.SuperLike } }, mockContext, {} as any)).rejects.toThrow(
      new GraphQLError('Match save error', { extensions: { code: 'ERROR' } })
    );
    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockTargetProfile.likes).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockSwiperProfile.matches).toContainEqual(new mongoose.Types.ObjectId('user2'));
    expect(mockTargetProfile.save).toHaveBeenCalledTimes(2);
    expect(mockSwiperProfile.save).toHaveBeenCalledTimes(1);
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle LIKE action with match and cover match creation logic', async () => {
    (Swipe.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) })
      .mockReturnValueOnce({
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ swiperId: 'user2', targetId: 'user1', action: SwipeAction.Like }),
      });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockResolvedValue(true) };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    const result = await swipe!({}, { input: mockInput }, mockContext, {} as any);

    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockTargetProfile.likes).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockSwiperProfile.matches).toContainEqual(new mongoose.Types.ObjectId('user2'));
    expect(mockTargetProfile.matches).toContainEqual(new mongoose.Types.ObjectId('user1'));
    expect(mockTargetProfile.save).toHaveBeenCalledTimes(2);
    expect(mockSwiperProfile.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      message: 'Match боллоо!',
      response: SwipeResponse.MatchCreated,
      match: {
        likeduserId: mockSwiperProfile,
        matcheduserId: mockTargetProfile,
      },
    });
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should handle error when non-Error object is thrown', async () => {
    (Swipe.findOne as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    (Profile.findOne as jest.Mock)
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockSwiperProfile) })
      .mockReturnValueOnce({ session: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockTargetProfile) });

    const mockSwipeInstance = { save: jest.fn().mockRejectedValue('String error') };
    (Swipe as any).mockImplementation(() => mockSwipeInstance);

    await expect(swipe!({}, { input: mockInput }, mockContext, {} as any)).rejects.toThrow(
      new GraphQLError('Алдаа гарлаа', { extensions: { code: 'ERROR' } })
    );
    expect(mockSwipeInstance.save).toHaveBeenCalled();
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
