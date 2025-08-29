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

describe('getMessage Complex Sender Data', () => {
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
        it('should handle message with complex sender data', async () => {
            const complexSenderMessage = {
                ...mockMessage,
                sender: {
                    ...mockMessage.sender,
                    profile: {
                        name: 'John Doe',
                        age: 30,
                        bio: 'Software developer',
                        interests: ['coding', 'music', 'travel'],
                    },
                },
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(complexSenderMessage);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });

        it('should handle message with complex receiver data', async () => {
            const complexReceiverMessage = {
                ...mockMessage,
                receiver: {
                    ...mockMessage.receiver,
                    profile: {
                        name: 'Jane Smith',
                        age: 28,
                        bio: 'Designer',
                        interests: ['art', 'photography'],
                    },
                },
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(complexReceiverMessage);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });

        it('should handle message with both complex sender and receiver data', async () => {
            const complexMessage = {
                ...mockMessage,
                sender: {
                    ...mockMessage.sender,
                    profile: { name: 'John', bio: 'Developer' },
                },
                receiver: {
                    ...mockMessage.receiver,
                    profile: { name: 'Jane', bio: 'Designer' },
                },
            };

            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(complexMessage);

            const result = await getMessage(null, { id: mockMessageId }, {}, {});

            expect(result).toBeDefined();
            expect(result.id).toBe(mockMessageId);
        });
    });
}); 