import { Types } from 'mongoose';
import { User as UserModel, ProfileModel, Message as MessageModel, Match as MatchModel } from '../../../src/models';
import { getConversations } from '../../../src/resolvers/queries/get-conversations.resolvers';

// Mock the models
jest.mock('../../../src/models', () => ({
    User: {
        findById: jest.fn(),
    },
    ProfileModel: {
        findOne: jest.fn(),
        findById: jest.fn(),
    },
    Message: {
        find: jest.fn(),
    },
    Match: {
        find: jest.fn(),
    },
}));

// Mock the formatting utility
jest.mock('../../../src/utils/get-conversations.formatting', () => ({
    formatConversation: jest.fn((user, profile, messages) => ({
        id: user._id.toString(),
        userId: user._id.toString(),
        name: profile.name || 'Unknown User',
        email: user.email,
        lastMessage: messages.length > 0 ? messages[0].content : null,
        messageCount: messages.length,
        lastMessageAt: messages.length > 0 ? messages[0].createdAt : null,
    })),
}));

// Mock the validation utility
jest.mock('../../../src/utils/get-conversations.validation', () => ({
    validateUserId: jest.fn(),
}));

// Mock the types
jest.mock('../../../src/types/get-conversations.types', () => ({
    ERRORS: {
        INVALID_USER_ID: 'Invalid user ID format',
        USER_NOT_FOUND: 'User not found',
        FETCH_FAILED: 'Failed to fetch conversations',
    },
}));

describe('Get Conversations Query Core', () => {
    const mockUserId = new Types.ObjectId().toString();
    const mockProfileId = new Types.ObjectId().toString();
    const mockOtherUserId = new Types.ObjectId().toString();
    const mockOtherProfileId = new Types.ObjectId().toString();

    const mockUserProfile = {
        _id: new Types.ObjectId(mockProfileId),
        userId: new Types.ObjectId(mockUserId),
        name: 'Test User',
        likes: [new Types.ObjectId()],
        matches: [new Types.ObjectId()],
    };

    const mockOtherUser = {
        _id: new Types.ObjectId(mockOtherUserId),
        email: 'other@example.com',
        password: 'hashedPassword',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    };

    const mockOtherProfile = {
        _id: new Types.ObjectId(mockOtherProfileId),
        userId: new Types.ObjectId(mockOtherUserId),
        name: 'Other User',
        likes: [],
        matches: [],
    };

    const mockMatch = {
        _id: new Types.ObjectId(),
        likeduserId: new Types.ObjectId(mockProfileId),
        matcheduserId: new Types.ObjectId(mockOtherProfileId),
        createdAt: new Date('2023-01-01'),
    };

    const mockFormattedConversation = {
        id: mockOtherUserId,
        userId: mockOtherUserId,
        name: 'Other User',
        email: 'other@example.com',
        lastMessage: null,
        messageCount: undefined,
        lastMessageAt: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getConversations', () => {
        it('should return conversations successfully', async () => {
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

            expect(result).toEqual([mockFormattedConversation]);
            expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: new Types.ObjectId(mockUserId) });
            expect(MatchModel.find).toHaveBeenCalledWith({
                $or: [
                    { likeduserId: mockUserProfile._id },
                    { matcheduserId: mockUserProfile._id }
                ]
            });
        });
        it('should filter out null conversations', async () => {
            // Mock ProfileModel.findOne for user profile
            (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(mockUserProfile);

            // Mock Match.find for matches
            (MatchModel.find as jest.Mock).mockResolvedValueOnce([mockMatch]);

            // Mock ProfileModel.findById for other user profile
            (ProfileModel.findById as jest.Mock).mockResolvedValueOnce(mockOtherProfile);

            // Mock User.findById for other user (return null to simulate missing user)
            (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

            const result = await getConversations(null, { userId: mockUserId }, {}, {});

            expect(result).toEqual([]);
        });
    });
}); 