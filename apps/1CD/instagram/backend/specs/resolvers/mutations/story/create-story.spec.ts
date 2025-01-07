import { GraphQLResolveInfo } from 'graphql';
import { storyModel } from 'src/models';
import { createStory } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/story.model.ts');

describe('createStory', () => {
  const mockInput = {
    userId: 'user-id',
    description: 'Sample description',
    image: 'image-url',
  };

  const mockNewStory = {
    _id: 'new-story-id',
    userId: 'user-id',
    userStories: [
      {
        story: {
          _id: 'story-object-id',
          description: 'Sample description',
          image: 'image-url',
        },
      },
    ],
    save: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new story if userId has no existing story', async () => {
    (storyModel.findOne as jest.Mock).mockResolvedValue(null);
    (storyModel.create as jest.Mock).mockResolvedValue(mockNewStory);

    const result = await createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo);

    expect(storyModel.findOne).toHaveBeenCalledWith({ userId: mockInput.userId });
    expect(storyModel.create).toHaveBeenCalledWith({
      userId: mockInput.userId,
      userStories: [
        {
          story: {
            _id: expect.anything(),
            description: mockInput.description,
            image: mockInput.image,
          },
        },
      ],
    });
    expect(result).toEqual(mockNewStory);
  });

  it('should add a new story to existing user stories', async () => {
    const existingStory = {
      _id: 'existing-story-id',
      userId: 'user-id',
      userStories: [
        {
          story: {
            _id: 'existing-story-object-id',
            description: 'Existing description',
            image: 'existing-image-url',
          },
        },
      ],
      save: jest.fn().mockResolvedValue(mockNewStory),
    };

    (storyModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    const result = await createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo);

    expect(storyModel.findOne).toHaveBeenCalledWith({ userId: mockInput.userId });
    expect(existingStory.userStories).toContainEqual({
      story: {
        _id: expect.anything(),
        description: mockInput.description,
        image: mockInput.image,
      },
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
      userId: 'user-id',
      userStories: [
        {
          story: {
            _id: 'existing-story-object-id',
            description: 'Existing description',
            image: 'existing-image-url',
          },
        },
      ],
      save: jest.fn().mockRejectedValue(new Error('Save failed')),
    };

    (storyModel.findOne as jest.Mock).mockResolvedValue(existingStory);

    await expect(createStory!({}, { input: mockInput }, { userId: 'user-id' }, {} as GraphQLResolveInfo)).rejects.toThrow('Save failed');

    expect(storyModel.findOne).toHaveBeenCalledWith({ userId: mockInput.userId });
    expect(existingStory.save).toHaveBeenCalled();
  });
});
