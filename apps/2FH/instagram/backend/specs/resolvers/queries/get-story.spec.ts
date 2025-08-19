import { Story } from 'src/models/story';
import { StoryResolvers } from '../../../src/resolvers/queries/get-story';
import { Context } from '../../../src/types/context'; // context төрөл

jest.mock('src/models/story');

describe('getStoryByUserId', () => {
  const mockContext: Context = { userId: '123' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array if no stories found', async () => {
    const populateMock = jest.fn().mockResolvedValue([]);
    (Story.find as jest.Mock).mockReturnValue({ populate: populateMock });

    const result = await StoryResolvers.Query.getStoryByUserId(
      {} as unknown,
      { author: '123' },
      mockContext
    );

    expect(result).toEqual([]);
    expect(Story.find).toHaveBeenCalledWith({
      author: '123',
      expiredAt: { $gt: expect.any(Date) },
    });
    expect(populateMock).toHaveBeenCalledWith('author');
  });

  it('should throw an error if the user is not authenticated', async () => {
    const unauthContext = { userId: undefined } as Context;

    await expect(
      StoryResolvers.Query.getStoryByUserId({}, { author: '123' }, unauthContext)
    ).rejects.toThrow('Unauthorized');
  });

  it('should return stories for the user', async () => {
    const mockStory = [
      {
        _id: '123',
        author: '123',
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    ];

    const populateMock = jest.fn().mockResolvedValue(mockStory);
    (Story.find as jest.Mock).mockReturnValue({ populate: populateMock });

    const result = await StoryResolvers.Query.getStoryByUserId(
      {} as unknown,
      { author: '123' },
      mockContext
    );

    expect(result).toEqual(mockStory);
    expect(Story.find).toHaveBeenCalledWith({
      author: '123',
      expiredAt: { $gt: expect.any(Date) },
    });
    expect(populateMock).toHaveBeenCalledWith('author');
  });
});
