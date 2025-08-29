import { getConversations } from '../../../src/resolvers/queries/get-conversations.resolvers';
import { ProfileModel, Match as MatchModel, User as UserModel } from '../../../src/models';
import { Types } from 'mongoose';

// Mock the models
jest.mock('../../../src/models', () => ({
    ProfileModel: {
        findOne: jest.fn(),
        findById: jest.fn(),
    },
    Match: {
        find: jest.fn(),
    },
    User: {
        findById: jest.fn(),
    },
    Message: {
        find: jest.fn(),
    },
}));

// Mock the validation utility
jest.mock('../../../src/utils/get-conversations.validation', () => ({
    validateUserId: jest.fn(),
}));

describe('getConversations Advanced Extended', () => {
    const mockUserId = new Types.ObjectId().toString();
    const mockOtherUserId = new Types.ObjectId().toString();

    const mockUserProfile = {
        _id: new Types.ObjectId(),
        userId: mockUserId,
        name: 'Test User',
        age: 25,
        gender: 'male',
        photos: ['photo1.jpg', 'photo2.jpg'],
        bio: 'Test bio',
        location: { type: 'Point', coordinates: [0, 0] },
        interests: ['reading', 'music'],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockOtherProfile = {
        _id: new Types.ObjectId(),
        userId: mockOtherUserId,
        name: 'Other User',
        age: 28,
        gender: 'female',
        photos: ['photo3.jpg'],
        bio: 'Other bio',
        location: { type: 'Point', coordinates: [0, 0] },
        interests: ['sports', 'travel'],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockMatch = {
        _id: new Types.ObjectId(),
        users: [mockUserId, mockOtherUserId],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Error handling edge cases', () => {
        it('should handle network timeout errors', async () => {
            (ProfileModel.findOne as jest.Mock).mockRejectedValueOnce(
                new Error('Network timeout')
            );

            await expect(
                getConversations(null, { userId: mockUserId }, {}, {})
            ).rejects.toThrow('Failed to fetch conversations');
        });

        it('should handle database constraint violations', async () => {
            (ProfileModel.findOne as jest.Mock).mockRejectedValueOnce(
                new Error('Duplicate key error')
            );

            await expect(
                getConversations(null, { userId: mockUserId }, {}, {})
            ).rejects.toThrow('Failed to fetch conversations');
        });

        it('should handle malformed ObjectId errors', async () => {
            const malformedId = 'malformed-id-123';
            await expect(
                getConversations(null, { userId: malformedId }, {}, {})
            ).rejects.toThrow('Failed to fetch conversations');
        });

        it('should handle very long userId input', async () => {
            const veryLongId = 'a'.repeat(1000);
            await expect(
                getConversations(null, { userId: veryLongId }, {}, {})
            ).rejects.toThrow('Failed to fetch conversations');
        });
    });

    describe('Edge case scenarios', () => {
        it('should handle empty matches array', async () => {
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([]);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should handle missing other user profile', async () => {
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([mockMatch]);
            (ProfileModel.findById as jest.Mock).mockResolvedValueOnce(null);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle missing other user data', async () => {
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([mockMatch]);
            (ProfileModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherProfile);
            (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });
}); 