import { Types } from 'mongoose';
import { getMessages, getMessage } from '../../../src/resolvers/queries/get-messages.resolvers';
import { Message as MessageModel } from '../../../src/models';

// Mock the models
jest.mock('../../../src/models', () => ({
    Message: {
        find: jest.fn(),
        findById: jest.fn(),
    },
}));

describe('getMessages and getMessage Error Handling', () => {
    const mockSenderId = new Types.ObjectId().toString();
    const mockReceiverId = new Types.ObjectId().toString();
    const mockMessageId = new Types.ObjectId().toString();

    // mockMessage removed as it's not used in this file

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Error handling scenarios', () => {
        it('should handle database errors for getMessages', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Database connection error')),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            await expect(
                getMessages(null, {
                    senderId: mockSenderId,
                    receiverId: mockReceiverId,
                }, {}, {})
            ).rejects.toThrow('Failed to fetch messages');
        });

        it('should handle database errors for getMessage', async () => {
            (MessageModel.findById as jest.Mock).mockRejectedValue(
                new Error('Database connection error')
            );

            await expect(
                getMessage(null, { id: mockMessageId }, {}, {})
            ).rejects.toThrow('Failed to fetch message');
        });

        it('should handle invalid ObjectId format for getMessages senderId', async () => {
            const invalidSenderId = 'invalid-sender-id';

            await expect(
                getMessages(null, {
                    senderId: invalidSenderId,
                    receiverId: mockReceiverId,
                }, {}, {})
            ).rejects.toThrow('Invalid ID format');
        });

        it('should handle invalid ObjectId format for getMessages receiverId', async () => {
            const invalidReceiverId = 'invalid-receiver-id';

            await expect(
                getMessages(null, {
                    senderId: mockSenderId,
                    receiverId: invalidReceiverId,
                }, {}, {})
            ).rejects.toThrow('Invalid ID format');
        });

        it('should handle query execution failure', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Query execution failed')),
            };

            (MessageModel.find as jest.Mock).mockReturnValue(mockQuery);

            await expect(
                getMessages(null, {
                    senderId: mockSenderId,
                    receiverId: mockReceiverId,
                }, {}, {})
            ).rejects.toThrow('Failed to fetch messages');
        });

        it('should handle message not found for getMessage', async () => {
            (MessageModel.findById as jest.Mock).mockResolvedValueOnce(null);

            await expect(
                getMessage(null, { id: mockMessageId }, {}, {})
            ).rejects.toThrow('Message not found');
        });

        it('should handle invalid ObjectId format for getMessage', async () => {
            const invalidId = 'invalid-id-format';

            await expect(
                getMessage(null, { id: invalidId }, {}, {})
            ).rejects.toThrow('Invalid ID format');
        });
    });
}); 