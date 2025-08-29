import { Types } from "mongoose";

// Mock sender and receiver IDs
export const mockSenderId = new Types.ObjectId().toString();
export const mockReceiverId = new Types.ObjectId().toString();

// Mock sender user object
export const mockSender = {
    _id: mockSenderId,
    email: 'sender@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
};

// Mock receiver user object
export const mockReceiver = {
    _id: mockReceiverId,
    email: 'receiver@example.com',
    password: 'hashedPassword456',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
};

// Mock message object
export const mockMessage = {
    _id: new Types.ObjectId(),
    sender: new Types.ObjectId(mockSenderId),
    receiver: new Types.ObjectId(mockReceiverId),
    content: 'Hello, how are you?',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
};

// Mock context object
export const mockContext = {
    user: {
        id: mockSenderId,
        email: 'sender@example.com'
    }
};

// Mock send message input
export const createMockSendMessageInput = () => ({
    senderId: mockSenderId,
    receiverId: mockReceiverId,
    content: 'Hello, how are you?',
}); 