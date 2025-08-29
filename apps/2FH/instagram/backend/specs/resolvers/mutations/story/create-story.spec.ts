import { createStory } from 'src/resolvers/mutations'; 
import { Story } from 'src/models';
import { User } from 'src/models/user';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

jest.mock('src/models');
jest.mock('src/models/user');
const mockStory = Story as jest.Mocked<typeof Story>;
const mockUser = User as jest.Mocked<typeof User>;
describe('createStory', () => {
    const mockContext = { userId: '507f1f77bcf86cd799439011' };
    const mockInput = { image: 'test-image.jpg' };
    const mockStoryData = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        author: new Types.ObjectId('507f1f77bcf86cd799439011'),
        image: 'test-image.jpg',
        expiredAt: new Date('2022-01-02T00:00:00.000Z')
    };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should create story successfully', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        const result = await createStory(null, { input: mockInput }, mockContext);
        expect(mockUser.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(mockStory.create).toHaveBeenCalledWith({
            author: new Types.ObjectId('507f1f77bcf86cd799439011'),
            image: 'test-image.jpg',
            expiredAt: new Date('2022-01-02T00:00:00.000Z')
        });
        expect(result).toEqual(mockStoryData);
    });
    it('should throw error when user is not authenticated', async () => {
        await expect(createStory(null, { input: mockInput }, { userId: '' }))
            .rejects.toThrow('User is not authenticated');
        await expect(createStory(null, { input: mockInput }, { userId: null as any }))
            .rejects.toThrow('User is not authenticated');
    });
    it('should throw error when user does not exist', async () => {
        mockUser.findById.mockResolvedValue(null);
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('User not found');
    });
    it('should throw error when image is invalid', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        await expect(createStory(null, { input: { image: '' } }, mockContext))
            .rejects.toThrow('Image is required');
        await expect(createStory(null, { input: { image: '   ' } }, mockContext))
            .rejects.toThrow('Image is required');
        await expect(createStory(null, { input: { image: null as any } }, mockContext))
            .rejects.toThrow('Image is required');
    });
    it('should handle story creation errors', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockRejectedValue(new Error('DB Error'));
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: DB Error');
    });
    it('should handle user update failure', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue(null);
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to update user with new story');
    });
    it('should preserve GraphQLError when thrown', async () => {
        const customError = new GraphQLError('Custom error');
        mockUser.findById.mockRejectedValue(customError);
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toBe(customError);
    });
    it('should handle unknown error types', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockRejectedValue('Unknown error');
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Unknown error');
    });
    it('should handle non-Error objects', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockRejectedValue({ code: 500 });
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Unknown error');
    });
    it('should handle user update database errors', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockRejectedValue(new Error('Connection timeout'));
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Connection timeout');
    });
    it('should handle GraphQLError during user update', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        const graphqlError = new GraphQLError('Database update failed');
        mockUser.findByIdAndUpdate.mockRejectedValue(graphqlError);
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toBe(graphqlError);
    });
    it('should set correct expiration date (24 hours from now)', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        await createStory(null, { input: mockInput }, mockContext);
        const expectedExpiredAt = new Date('2022-01-02T00:00:00.000Z');
        expect(mockStory.create).toHaveBeenCalledWith(
            expect.objectContaining({ 
                author: new Types.ObjectId('507f1f77bcf86cd799439011'),
                expiredAt: expectedExpiredAt 
            })
        );
    });
    it('should handle user validation database error', async () => {
        const dbError = new Error('Database connection failed');
        mockUser.findById.mockRejectedValue(dbError);
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Database connection failed');
    });
    it('should handle undefined userId', async () => {
        await expect(createStory(null, { input: mockInput }, { userId: undefined as any }))
            .rejects.toThrow('User is not authenticated');
    });
    it('should handle whitespace-only image with tabs and newlines', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        await expect(createStory(null, { input: { image: '\t\n\r' } }, mockContext))
            .rejects.toThrow('Image is required');
    });
    it('should handle string errors during user update', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockRejectedValue('Network error');
        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Unknown error');
    });
    it('should call updateUserStory with correct story ID', async () => {
        mockUser.findById.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);
        await createStory(null, { input: mockInput }, mockContext);
        expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
            '507f1f77bcf86cd799439011',
            { $push: { stories: mockStoryData._id.toString() } },
            { new: true }
        );
    });
});