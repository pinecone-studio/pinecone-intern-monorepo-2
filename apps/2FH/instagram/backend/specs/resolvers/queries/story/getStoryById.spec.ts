import { getStoryById } from "src/resolvers/queries/story/get-story-by-id";
import { Story } from "src/models/story";
import { Types } from "mongoose";
import { GraphQLError } from "graphql";

jest.mock('src/models/story');

describe('getStoryById', () => {
    const mockUser = { id: new Types.ObjectId().toString(), username: 'testuser' };
    const mockContext = { user: mockUser };
    const baseStory = {
        _id: new Types.ObjectId(),
        author: { _id: new Types.ObjectId(mockUser.id), username: 'author' },
        expiredAt: new Date(Date.now() + 100000),
        viewers: [],
        save: jest.fn(),
        populate: jest.fn(),
    };

    const mockPopulateChain = (story: any) => {
        const mockPopulate2 = jest.fn().mockResolvedValue(story);
        const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
        (Story.findById as jest.Mock).mockReturnValue({ populate: mockPopulate1 });
    };

    afterEach(() => jest.clearAllMocks());

    it('should throw error if story ID is missing', async () => {
        await expect(getStoryById({}, { _id: '' }, mockContext)).rejects.toThrow(
            new GraphQLError('Story ID is required')
        );
    });

    it('should throw error if story is not found', async () => {
        mockPopulateChain(null);
        await expect(getStoryById({}, { _id: 'fake-id' }, mockContext)).rejects.toThrow(
            new GraphQLError('Story not found')
        );
    });

    it('should throw error if story has expired', async () => {
        const expiredStory = { ...baseStory, expiredAt: new Date(Date.now() - 10000) };
        mockPopulateChain(expiredStory);
        await expect(getStoryById({}, { _id: 'story-id' }, mockContext)).rejects.toThrow(
            new GraphQLError('Story has expired')
        );
    });

    it('should return story if user is author', async () => {
        const story = { ...baseStory, author: { _id: new Types.ObjectId(mockUser.id) }, viewers: [] };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
    });

    it('should return story and add viewer if user is not author and has not viewed', async () => {
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).toHaveBeenCalled();
        expect(story.viewers.length).toBe(1);
    });

    it('should not add viewer if user already viewed', async () => {
        const userObjectId = new Types.ObjectId(mockUser.id);
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [userObjectId], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
    });

    it('should handle unauthenticated user', async () => {
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, { user: undefined });
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
        expect(story.viewers.length).toBe(0);
    });

    it('should handle populated viewers correctly', async () => {
        const populatedViewer = { _id: new Types.ObjectId(mockUser.id), username: 'viewer' };
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [populatedViewer], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
    });

    it('should handle mixed viewer types', async () => {
        const otherUserId = new Types.ObjectId();
        const populatedViewer = { _id: otherUserId, username: 'viewer' };
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [populatedViewer], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).toHaveBeenCalled();
        expect(story.viewers.length).toBe(2);
    });

    it('should handle story without expiredAt field', async () => {
        const story = { ...baseStory, expiredAt: null, author: { _id: new Types.ObjectId(mockUser.id) } };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
    });

    it('should handle viewer without equals method', async () => {
        const mockViewer = { toString: () => 'different-user-id' };
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [mockViewer], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).toHaveBeenCalled();
        expect(story.viewers.length).toBe(2);
    });

    it('should handle viewer with equals method returning true', async () => {
        const userObjectId = new Types.ObjectId(mockUser.id);
        const mockViewer = { equals: jest.fn().mockReturnValue(true) };
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [mockViewer], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
        expect(mockViewer.equals).toHaveBeenCalledWith(userObjectId);
    });

    it('should handle viewer toString matching user id', async () => {
        const mockViewer = { toString: () => mockUser.id };
        const story = { ...baseStory, author: { _id: new Types.ObjectId() }, viewers: [mockViewer], save: jest.fn() };
        mockPopulateChain(story);
        const result = await getStoryById({}, { _id: 'story-id' }, mockContext);
        expect(result).toEqual(story);
        expect(story.save).not.toHaveBeenCalled();
    });
});