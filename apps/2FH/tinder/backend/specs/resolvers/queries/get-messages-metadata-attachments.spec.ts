import { Types } from 'mongoose';
import { getMessage } from '../../../src/resolvers/queries/get-messages.resolvers';
import { Message as MessageModel } from '../../../src/models';

// Mock the models
jest.mock('../../../src/models', () => ({
    Message: {
        find: jest.fn(),
        findById: jest.fn(),
    },
}));

describe('getMessage Metadata and Attachments', () => {
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

    describe('Advanced getMessage scenarios', () => {
        it('should handle message with additional metadata', async () => {
            const messageWithMetadata = {
                ...mockMessage,
                metadata: {
                    edited: true,
                    editedAt: new Date('2023-01-01T11:00:00Z'),
                    readBy: [mockReceiverId],
                    readAt: new Date('2023-01-01T10:30:00Z'),
                },
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(messageWithMetadata);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });

        it('should handle message with attachments', async () => {
            const messageWithAttachments = {
                ...mockMessage,
                attachments: [
                    {
                        type: 'image',
                        url: 'https://example.com/image.jpg',
                        filename: 'image.jpg',
                        size: 1024000,
                    },
                    {
                        type: 'document',
                        url: 'https://example.com/document.pdf',
                        filename: 'document.pdf',
                        size: 2048000,
                    },
                ],
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(messageWithAttachments);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });

        it('should handle message with reactions', async () => {
            const messageWithReactions = {
                ...mockMessage,
                reactions: [
                    {
                        userId: mockSenderId,
                        emoji: '👍',
                        createdAt: new Date('2023-01-01T10:15:00Z'),
                    },
                    {
                        userId: mockReceiverId,
                        emoji: '❤️',
                        createdAt: new Date('2023-01-01T10:20:00Z'),
                    },
                ],
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(messageWithReactions);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });
    });
}); 