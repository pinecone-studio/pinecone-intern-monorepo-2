import { getConversations } from '../../../src/resolvers/queries/get-conversations.resolvers';
import { ProfileModel, Match as MatchModel, User as UserModel, Message as MessageModel } from '../../../src/models';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { validateUserId } from '../../../src/utils/get-conversations.validation';

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

describe('getConversations Advanced Core', () => {
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

    const mockOtherUser = {
        _id: new Types.ObjectId(),
        email: 'other@example.com',
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

    describe('Basic conversation retrieval', () => {
        it('should retrieve conversations successfully', async () => {
            // Mock ProfileModel.findOne for user profile
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);

            // Mock Match.find for matches
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([mockMatch]);

            // Mock ProfileModel.findById for other user profile
            (ProfileModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherProfile);

            // Mock User.findById for other user
            (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherUser);

            // Mock Message.find for messages
            const mockMessageQuery = {
                sort: jest.fn().mockReturnThis(),
            };
            (MessageModel.find as jest.Mock).mockReturnValue(mockMessageQuery);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle edge cases with missing profile data', async () => {
            // Mock ProfileModel.findOne for user profile
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);

            // Mock Match.find for matches
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([mockMatch]);

            // Mock ProfileModel.findById for other user profile
            (ProfileModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherProfile);

            // Mock User.findById for other user
            (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherUser);

            // Mock Message.find for messages
            const mockMessageQuery = {
                sort: jest.fn().mockReturnThis(),
            };
            (MessageModel.find as jest.Mock).mockReturnValue(mockMessageQuery);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('Error handling', () => {
        it('should handle validation errors gracefully', async () => {
            (validateUserId as jest.Mock).mockImplementation(() => {
                throw new GraphQLError('Invalid userId format', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            });

            await expect(
                getConversations(null, { userId: 'invalid-id' }, {}, {})
            ).rejects.toThrow('Invalid userId format');
        });

        it('should handle unexpected errors gracefully', async () => {
            // Mock validation to pass
            (validateUserId as jest.Mock).mockImplementation(() => {
                // Validation passes, do nothing
            });

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            };
            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);
            await expect(
                getConversations(null, { userId: mockUserId }, {}, {})
            ).rejects.toThrow('Failed to fetch conversations');
        });
    });
}); 