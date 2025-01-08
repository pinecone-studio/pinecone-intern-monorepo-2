import { GraphQLResolveInfo } from 'graphql';
import { storyModel } from 'src/models';
import { createStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story.model.ts');

describe('createStory', () => {
  const mockInput = {
    user: 'user-id',
    image: 'image-url',
  };

  const mockNewStory = {
    _id: 'new-story-id',
    user: 'user-id',
    stories: [
      {
        _id: 'story-object-id',
        image: 'image-url',
      },
    ],
    save: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new story if user has no existing stories', async () => {
    (storyModel.findOne as jest.Mock).mockResolvedValue(null);
    (storyModel.create as jest.Mock).mockResolvedValue(mockNewStory);

    const result = await createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo);

    expect(storyModel.findOne).toHaveBeenCalledWith({ user: mockInput.user });
    expect(storyModel.create).toHaveBeenCalledWith({
      user: mockInput.user,
      stories: [
        {
          _id: expect.anything(),
          image: mockInput.image,
        },
      ],
    });
    expect(result).toEqual(mockNewStory);
  });

  it('should add a new story to existing user stories', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      user: 'user-id',
      stories: [
        {
          _id: 'existing-story-object-id',
          image: 'existing-image-url',
        },
      ],
      save: jest.fn().mockResolvedValue(mockNewStory),
    };

    (storyModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    const result = await createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo);

    expect(storyModel.findOne).toHaveBeenCalledWith({ user: mockInput.user });
    expect(existingStory.stories).toContainEqual({
      _id: expect.anything(),
      image: mockInput.image,
    });
    expect(existingStory.save).toHaveBeenCalled();
    expect(result).toEqual(mockNewStory);
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(createStory!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if save fails', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      user: 'user-id',
      stories: [
        {
          _id: 'existing-story-object-id',
          image: 'existing-image-url',
        },
      ],
      save: jest.fn().mockRejectedValue(new Error('Save failed')),
    };

    (storyModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    await expect(createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo)).rejects.toThrow('Save failed');

    expect(storyModel.findOne).toHaveBeenCalledWith({ user: mockInput.user });
    expect(existingStory.save).toHaveBeenCalled();
  });
});
