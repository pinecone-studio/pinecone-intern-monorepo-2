import { Types } from 'mongoose';
import { getMessages } from '../../../src/resolvers/queries/get-messages.resolvers';
import { Message as MessageModel } from '../../../src/models';

// Mock the models
jest.mock('../../../src/models', () => ({
    Message: {
        find: jest.fn(),
        findById: jest.fn(),
    },
}));

describe('getMessages Invalid Data Cases', () => {
    const mockSenderId = new Types.ObjectId().toString();
    const mockReceiverId = new Types.ObjectId().toString();
    const mockMessageId = new Types.ObjectId().toString();

    const mockMessage = {
        _id: new Types.ObjectId(mockMessageId),
        sender: {
            _id: new Types.ObjectId(mockSenderId),
            email: 'sender@example.com',
        },
        receiver: {
            _id: new Types.ObjectId(mockReceiverId),
            email: 'receiver@example.com',
        },
        content: 'Hello, how are you?',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Edge case scenarios', () => {
        it('should handle messages with invalid date formats', async () => {
            const invalidDateMessage = {
                ...mockMessage,
                createdAt: 'invalid-date',
                updatedAt: 'invalid-date',
            };

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([invalidDateMessage]),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(null, {
                senderId: mockSenderId,
                receiverId: mockReceiverId,
            }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });

        it('should handle messages with missing required fields', async () => {
            const incompleteMessage = {
                _id: new Types.ObjectId(mockMessageId),
                content: 'Incomplete message',
            };

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([incompleteMessage]),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(null, {
                senderId: mockSenderId,
                receiverId: mockReceiverId,
            }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });
    });
}); 