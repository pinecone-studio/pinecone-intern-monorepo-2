import { createStory } from 'src/resolvers/mutations'; 
import { Story } from 'src/models';
import { User } from 'src/models/user';
import { GraphQLError } from 'graphql';

jest.mock('src/models');
jest.mock('src/models/user');

const mockStory = Story as jest.Mocked<typeof Story>;
const mockUser = User as jest.Mocked<typeof User>;

describe('createStory', () => {
    const mockContext = { userId: 'user123' };
    const mockInput = { image: 'test-image.jpg' };
    const mockStoryData = {
        _id: 'story123',
        author: 'user123',
        image: 'test-image.jpg',
        expiredAt: expect.any(Date)
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
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue({ _id: 'user123' } as any);

        const result = await createStory(null, { input: mockInput }, mockContext);

        expect(mockUser.findById).toHaveBeenCalledWith('user123');
        expect(mockStory.create).toHaveBeenCalledWith({
            author: 'user123',
            image: 'test-image.jpg',
            expiredAt: new Date('2022-01-02T00:00:00.000Z')
        });
        expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
            'user123',
            { $push: { stories: 'story123' } },
            { new: true }
        );
        expect(result).toEqual(mockStoryData);
    });

    it('should throw error when user is not authenticated', async () => {
        await expect(createStory(null, { input: mockInput }, { userId: '' }))
            .rejects.toThrow('User is not authenticated');
    });

    it('should throw error when user does not exist', async () => {
        mockUser.findById.mockResolvedValue(null);

        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('User not found');
    });

    it('should throw error when image is missing', async () => {
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);

        await expect(createStory(null, { input: { image: '' } }, mockContext))
            .rejects.toThrow('Image is required');
    });

    it('should throw error when image is whitespace only', async () => {
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);

        await expect(createStory(null, { input: { image: '   ' } }, mockContext))
            .rejects.toThrow('Image is required');
    });

    it('should throw error when story creation fails', async () => {
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);
        mockStory.create.mockRejectedValue(new Error('DB Error'));

        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: DB Error');
    });

    it('should throw error when user update fails', async () => {
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);
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
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);
        mockStory.create.mockRejectedValue('Unknown error');

        await expect(createStory(null, { input: mockInput }, mockContext))
            .rejects.toThrow('Failed to create story: Unknown error');
    });

    it('should set correct expiration date (24 hours from now)', async () => {
        mockUser.findById.mockResolvedValue({ _id: 'user123' } as any);
        mockStory.create.mockResolvedValue(mockStoryData as any);
        mockUser.findByIdAndUpdate.mockResolvedValue({ _id: 'user123' } as any);

        await createStory(null, { input: mockInput }, mockContext);

        const expectedExpiredAt = new Date('2022-01-02T00:00:00.000Z');
        expect(mockStory.create).toHaveBeenCalledWith(
            expect.objectContaining({ expiredAt: expectedExpiredAt })
        );
    });
});