import { GraphQLResolveInfo } from 'graphql';
import { viewStoryModel } from 'src/models';
import { createViewStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story-view.model.ts');

describe('createViewStory', () => {
  const mockInput = {
    user: 'user-id',
    storyId: 'story-id',
    isViewed: true,
  };

  const mockNewStory = {
    _id: 'new-story-id',
    watchedUsers: [{ user: 'user-id', isViewed: true }],
    storyId: 'story-id',
    save: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new viewStory if storyId is not found', async () => {
    (viewStoryModel.findOne as jest.Mock).mockResolvedValue(null);
    (viewStoryModel.create as jest.Mock).mockResolvedValue(mockNewStory);

    const result = await createViewStory!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(viewStoryModel.findOne).toHaveBeenCalledWith({ storyId: mockInput.storyId });
    expect(viewStoryModel.create).toHaveBeenCalledWith({
      watchedUsers: [{ user: mockInput.user, isViewed: mockInput.isViewed }],
      storyId: mockInput.storyId,
    });
    expect(result).toEqual(mockNewStory);
  });

  it('should add a new user to watchedUsers if not already present', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      watchedUsers: [{ user: 'existing-user-id', isViewed: true }],
      storyId: 'story-id',
      save: jest.fn().mockResolvedValue(mockNewStory),
    };

    (viewStoryModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    const result = await createViewStory!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(viewStoryModel.findOne).toHaveBeenCalledWith({ storyId: mockInput.storyId });
    expect(existingStory.watchedUsers).toContainEqual({ user: 'user-id', isViewed: true });
    expect(existingStory.save).toHaveBeenCalled();
    expect(result).toEqual(mockNewStory);
  });

  it('should not add a duplicate user to watchedUsers', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      watchedUsers: [{ user: 'user-id', isViewed: true }],
      storyId: 'story-id',
      save: jest.fn().mockResolvedValue(mockNewStory),
    };

    (viewStoryModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    const result = await createViewStory!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(viewStoryModel.findOne).toHaveBeenCalledWith({ storyId: mockInput.storyId });
    expect(existingStory.watchedUsers.length).toBe(1);
    expect(existingStory.save).toHaveBeenCalled();
    expect(result).toEqual(mockNewStory);
  });

  it('should throw an error if save fails', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      watchedUsers: [{ user: 'existing-user-id', isViewed: true }],
      storyId: 'story-id',
      save: jest.fn().mockRejectedValue(new Error('Save failed')),
    };

    (viewStoryModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    await expect(createViewStory!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Save failed');

    expect(viewStoryModel.findOne).toHaveBeenCalledWith({ storyId: mockInput.storyId });
    expect(existingStory.save).toHaveBeenCalled();
  });
});
