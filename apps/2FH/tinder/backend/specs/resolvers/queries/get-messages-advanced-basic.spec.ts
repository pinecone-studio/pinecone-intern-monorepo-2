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

describe('getMessages and getMessage Advanced Basic', () => {
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

    describe('Advanced getMessages scenarios', () => {
        it('should handle multiple messages with different timestamps', async () => {
            const messages = [
                { ...mockMessage, createdAt: new Date('2023-01-01T10:00:00Z') },
                { ...mockMessage, createdAt: new Date('2023-01-01T11:00:00Z') },
                { ...mockMessage, createdAt: new Date('2023-01-01T12:00:00Z') },
                { ...mockMessage, createdAt: new Date('2023-01-01T13:00:00Z') },
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(messages),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(null, {
                senderId: mockSenderId,
                receiverId: mockReceiverId,
            }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(4);
        });

        it('should handle messages with special characters in content', async () => {
            const specialContentMessages = [
                {
                    ...mockMessage,
                    content: 'Hello! @#$%^&*()_+-=[]{}|;:,.<>?',
                },
                {
                    ...mockMessage,
                    content: 'Message with "quotes" and \'apostrophes\'',
                },
                {
                    ...mockMessage,
                    content: 'Line 1\nLine 2\nLine 3',
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(specialContentMessages),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(null, {
                senderId: mockSenderId,
                receiverId: mockReceiverId,
            }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(3);
        });

        it('should handle messages with very long content', async () => {
            const longContent = 'A'.repeat(10000);
            const longContentMessage = {
                ...mockMessage,
                content: longContent,
            };

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([longContentMessage]),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            const result = await getMessages(null, {
                senderId: mockSenderId,
                receiverId: mockReceiverId,
            }, {}, {});

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0].content).toBe(longContent);
        });
    });
}); 