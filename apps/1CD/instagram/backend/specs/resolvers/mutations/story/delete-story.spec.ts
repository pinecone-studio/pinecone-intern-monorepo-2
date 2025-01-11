import { GraphQLResolveInfo } from 'graphql';
import mongoose from 'mongoose';
import { storyModel } from 'src/models';
import { deleteStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    findOne: jest.fn(),
  },
}));

describe('deleteStory Mutation', () => {
  const mockUserId = 'mockUserId';
  const mockStoryId = new mongoose.Types.ObjectId().toString();

  const mockContext = { userId: mockUserId };

  const mockStoryDocument = {
    user: mockUserId,
    stories: [
      { _id: new mongoose.Types.ObjectId(mockStoryId), image: 'image1.png' },
      { _id: new mongoose.Types.ObjectId(), image: 'image2.png' },
    ],
    save: jest.fn(),
  };

  const mockUpdatedStoryDocument = {
    ...mockStoryDocument,
    stories: [{ _id: new mongoose.Types.ObjectId(), image: 'image2.png' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not authenticated', async () => {
    await expect(deleteStory!({}, { storyId: mockStoryId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the story is not found', async () => {
    (storyModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(deleteStory!({}, { storyId: mockStoryId }, mockContext, {} as GraphQLResolveInfo)).rejects.toThrow('Story not found or you are not authorized to delete this story');

    expect(storyModel.findOne).toHaveBeenCalledWith({ 'stories._id': mockStoryId, user: mockUserId });
  });

  it('should successfully delete a story', async () => {
    (storyModel.findOne as jest.Mock).mockResolvedValue(mockStoryDocument);
    (mockStoryDocument.save as jest.Mock).mockResolvedValue(mockUpdatedStoryDocument);

    const result = await deleteStory!({}, { storyId: mockStoryId }, mockContext, {} as GraphQLResolveInfo);

    expect(storyModel.findOne).toHaveBeenCalledWith({ 'stories._id': mockStoryId, user: mockUserId });
    expect(mockStoryDocument.stories.length).toBe(1);
    expect(mockStoryDocument.save).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Story deleted successfully',
      story: mockUpdatedStoryDocument,
    });
  });

  //   it('should throw an error if user is not authorized to delete the story', async () => {
  //     const otherUserId = 'otherUserId';
  //     const unauthorizedStoryDocument = { ...mockStoryDocument, user: otherUserId };

  //     (storyModel.findOne as jest.Mock).mockResolvedValue(unauthorizedStoryDocument);

  //     await expect(deleteStory!({}, { storyId: mockStoryId }, mockContext, {} as GraphQLResolveInfo)).rejects.toThrow('Story not found or you are not authorized to delete this story');
  //   });
});
