import { swipe } from '../../../src/resolvers/mutations/swipe-mutation';
import { Swipe, Profile } from '../../../src/models';
import { SwipeResponse, SwipeInput, SwipeAction } from '../../../src/generated';
import mongoose from 'mongoose';

// Mock mongoose
jest.mock('mongoose', () => ({
    startSession: jest.fn(),
    Types: {
        ObjectId: jest.fn().mockImplementation((id) => ({ toString: () => id || 'mock-id' })),
    },
}));

// Mock models
const mockSwipeInstance = {
    save: jest.fn(),
};

jest.mock('../../../src/models', () => ({
    Swipe: jest.fn().mockImplementation(() => mockSwipeInstance),
    Profile: {
        findOne: jest.fn(),
    },
}));

// Add findOne to Swipe mock
const mockFindOne = jest.fn();
(Swipe as any).findOne = mockFindOne;

describe('swipe mutation - simplified', () => {
    const mockSwipeInput: SwipeInput = {
        swiperId: 'swiper123',
        targetId: 'target456',
        action: 'LIKE' as SwipeAction,
    };

    const mockSwiperProfile = {
        userId: 'swiper123',
        matches: [],
        likes: [],
        save: jest.fn(),
    };

    const mockTargetProfile = {
        userId: 'target456',
        matches: [],
        likes: [],
        save: jest.fn(),
    };

    const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
        mockSwipeInstance.save.mockResolvedValue(undefined);
    });

    it('should return error when swiperId equals targetId', async () => {
        const input = { ...mockSwipeInput, swiperId: 'same123', targetId: 'same123' };

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input }, {} as any, {} as any);

        expect(result).toEqual({
            success: false,
            message: 'Өөртөө swipe хийж болохгүй',
            response: SwipeResponse.Error,
        });
    });

    it('should return error when swipe already exists', async () => {
        mockFindOne.mockResolvedValue({
            swiperId: 'swiper123',
            targetId: 'target456',
            action: 'LIKE',
        });

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input: mockSwipeInput }, {} as any, {} as any);

        expect(result).toEqual({
            success: false,
            message: 'Энд хэрэглэгчийг аль хэдийн swipe хийсэн байна',
            response: SwipeResponse.AlreadySwiped,
        });
    });

    it('should return error when swiper profile not found', async () => {
        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(null) // swiperProfile not found
            .mockResolvedValueOnce(mockTargetProfile);

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input: mockSwipeInput }, {} as any, {} as any);

        expect(result).toEqual({
            success: false,
            message: 'Хэрэглэгч олдсонгүй',
            response: SwipeResponse.Error,
        });
    });

    it('should return error when target profile not found', async () => {
        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(mockSwiperProfile)
            .mockResolvedValueOnce(null); // targetProfile not found

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input: mockSwipeInput }, {} as any, {} as any);

        expect(result).toEqual({
            success: false,
            message: 'Хэрэглэгч олдсонгүй',
            response: SwipeResponse.Error,
        });
    });

    it('should return error when already matched', async () => {
        const swiperProfileWithMatch = {
            ...mockSwiperProfile,
            matches: [{ toString: () => 'target456' }],
        };

        // Mock findOne to return null for existing swipe check (first call)
        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(swiperProfileWithMatch)
            .mockResolvedValueOnce(mockTargetProfile);

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input: mockSwipeInput }, {} as any, {} as any);

        expect(result).toEqual({
            success: false,
            message: 'Энд хэрэглэгчтэй аль хэдийн match болсон байна',
            response: SwipeResponse.AlreadySwiped,
        });
    });

    it('should handle DISLIKE action without match logic', async () => {
        const dislikeInput = { ...mockSwipeInput, action: 'DISLIKE' as SwipeAction };

        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(mockSwiperProfile)
            .mockResolvedValueOnce(mockTargetProfile);

        if (!swipe) throw new Error('swipe is undefined');
        const result = await swipe({}, { input: dislikeInput }, {} as any, {} as any);

        expect(mockSwipeInstance.save).toHaveBeenCalledWith({ session: mockSession });
        expect(mockTargetProfile.likes).not.toContainEqual({ toString: () => 'swiper123' });
        expect(mockTargetProfile.save).not.toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();

        expect(result).toEqual({
            success: true,
            message: 'Swipe амжилттай хийгдлээ',
            response: SwipeResponse.Success,
            match: undefined,
        });
    });

    it('should handle transaction error and abort', async () => {
        mockSwipeInstance.save.mockRejectedValue(new Error('Database error'));

        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(mockSwiperProfile)
            .mockResolvedValueOnce(mockTargetProfile);

        if (!swipe) throw new Error('swipe is undefined');
        await expect(swipe({}, { input: mockSwipeInput }, {} as any, {} as any))
            .rejects.toThrow('Database error');

        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should handle unknown error in transaction', async () => {
        mockSwipeInstance.save.mockRejectedValue('Unknown error');

        mockFindOne.mockResolvedValue(null);
        (Profile.findOne as jest.Mock)
            .mockResolvedValueOnce(mockSwiperProfile)
            .mockResolvedValueOnce(mockTargetProfile);

        if (!swipe) throw new Error('swipe is undefined');
        await expect(swipe({}, { input: mockSwipeInput }, {} as any, {} as any))
            .rejects.toThrow('Алдаа гарлаа');

        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});