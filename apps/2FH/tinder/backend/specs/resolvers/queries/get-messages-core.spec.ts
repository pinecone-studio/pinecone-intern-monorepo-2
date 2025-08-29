import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { Message as MessageModel } from '../../../src/models';
import { getMessages, getMessage } from '../../../src/resolvers/queries/get-messages.resolvers';

// Mock the models
jest.mock('../../../src/models', () => ({
    Message: {
        find: jest.fn(),
        findById: jest.fn(),
    },
}));

// Mock the validation utilities
jest.mock('../../../src/utils/get-messages.validation', () => ({
    validateObjectId: jest.fn(),
    validateUserIds: jest.fn(),
}));

// Mock the formatting utility
jest.mock('../../../src/utils/get-messages.formatting', () => ({
    formatMessage: jest.fn((message) => ({
        id: message._id.toString(),
        content: message.content,
        sender: message.sender,
        receiver: message.receiver,
        createdAt: message.createdAt,
    })),
}));

// Mock the types
jest.mock('../../../src/types/get-messages.types', () => ({
    ERRORS: {
        INVALID_ID: 'Invalid ID format',
        MESSAGE_NOT_FOUND: 'Message not found',
        FETCH_FAILED: 'Failed to fetch messages',
        INVALID_USER_ID: 'Invalid userId format',
    },
}));

describe('Get Messages Query Core', () => {
    const mockSenderId = new Types.ObjectId().toString();
    const mockReceiverId = new Types.ObjectId().toString();
    const mockMessageId = new Types.ObjectId().toString();

    const mockMessage = {
        _id: new Types.ObjectId(mockMessageId),
        content: 'Hello, how are you?',
        sender: {
            _id: new Types.ObjectId(mockSenderId),
            email: 'sender@example.com',
            password: 'hashedPassword',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        },
        receiver: {
            _id: new Types.ObjectId(mockReceiverId),
            email: 'receiver@example.com',
            password: 'hashedPassword',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        },
        createdAt: new Date('2023-01-01'),
    };

    const mockFormattedMessage = {
        id: mockMessageId,
        content: 'Hello, how are you?',
        sender: mockMessage.sender,
        receiver: mockMessage.receiver,
        createdAt: mockMessage.createdAt,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMessages', () => {
        it('should return messages when both senderId and receiverId are provided', async () => {
            const mockMessages = [mockMessage];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockMessages),
            };
            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(
                null,
                { senderId: mockSenderId, receiverId: mockReceiverId },
                {},
                {}
            );

            expect(result).toEqual([mockFormattedMessage]);
            expect(MessageModel.find).toHaveBeenCalledWith({
                sender: new Types.ObjectId(mockSenderId),
                receiver: new Types.ObjectId(mockReceiverId),
            });
        });

        it('should return messages when only senderId is provided', async () => {
            const mockMessages = [mockMessage];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockMessages),
            };
            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(
                null,
                { senderId: mockSenderId },
                {},
                {}
            );

            expect(result).toEqual([mockFormattedMessage]);
            expect(MessageModel.find).toHaveBeenCalledWith({
                sender: new Types.ObjectId(mockSenderId),
            });
        });






    });

    describe('getMessage', () => {
        it('should return a single message by ID', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockMessage),
            };
            (MessageModel.findById as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toEqual(mockFormattedMessage);
            expect(MessageModel.findById).toHaveBeenCalledWith(mockMessageId);
        });






    });
}); 