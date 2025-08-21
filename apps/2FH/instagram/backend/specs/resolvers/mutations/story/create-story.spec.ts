import { createStory } from 'src/resolvers/mutations';
import { Story, User } from 'src/models';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

jest.mock('src/models', () => ({
  Story: { create: jest.fn() },
  User: { findById: jest.fn() }
}));

const mockedStory = Story as jest.Mocked<typeof Story>;
const mockedUser = User as jest.Mocked<typeof User>;

describe('createStory resolver', () => {
  beforeEach(() => jest.clearAllMocks());

  const validInput = { image: 'https://example.com/image.jpg', author: '507f1f77bcf86cd799439011' };
  const mockUser = { _id: new Types.ObjectId(validInput.author), name: 'Test User' };
  const mockStory = { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'), 
    author: new Types.ObjectId(validInput.author), 
    image: validInput.image,
    viewers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    expiredAt: new Date()
  };

  it('should create story with valid input', async () => {
    mockedUser.findById.mockResolvedValue(mockUser as any);
    mockedStory.create.mockResolvedValue(mockStory as any);

    const result = await createStory(undefined, { input: validInput });

    expect(mockedUser.findById).toHaveBeenCalledWith({ _id: validInput.author });
    expect(mockedStory.create).toHaveBeenCalledWith({ author: validInput.author, image: validInput.image });
    expect(result).toEqual(mockStory);
  });

  it('should throw error when image is empty', async () => {
    await expect(createStory(undefined, { input: { ...validInput, image: '' } }))
      .rejects.toThrow(new GraphQLError('Image is required'));
    expect(mockedUser.findById).not.toHaveBeenCalled();
  });

  it('should throw error when image is whitespace', async () => {
    await expect(createStory(undefined, { input: { ...validInput, image: '   ' } }))
      .rejects.toThrow(new GraphQLError('Image is required'));
  });

  it('should throw error when image is null', async () => {
    await expect(createStory(undefined, { input: { ...validInput, image: null as any } }))
      .rejects.toThrow(new GraphQLError('Image is required'));
  });

  it('should throw error when author is empty', async () => {
    await expect(createStory(undefined, { input: { ...validInput, author: '' } }))
      .rejects.toThrow(new GraphQLError('User is not authenticated'));
  });

  it('should throw error when author is null', async () => {
    await expect(createStory(undefined, { input: { ...validInput, author: null as any } }))
      .rejects.toThrow(new GraphQLError('User is not authenticated'));
  });

  it('should handle User.findById errors', async () => {
    mockedUser.findById.mockRejectedValue(new Error('DB error'));
    await expect(createStory(undefined, { input: validInput }))
      .rejects.toThrow(new GraphQLError('Failed to create story DB error'));
  });

  it('should handle Story.create errors', async () => {
    mockedUser.findById.mockResolvedValue(mockUser as any);
    mockedStory.create.mockRejectedValue(new Error('Create error'));
    await expect(createStory(undefined, { input: validInput }))
      .rejects.toThrow(new GraphQLError('Failed to create story Create error'));
  });

  it('should handle non-Error objects', async () => {
    mockedUser.findById.mockResolvedValue(mockUser as any);
    mockedStory.create.mockRejectedValue('String error');
    await expect(createStory(undefined, { input: validInput }))
      .rejects.toThrow(new GraphQLError('Failed to create story Error'));
  });

  it('should re-throw existing GraphQLError', async () => {
    const gqlError = new GraphQLError('Custom error');
    mockedUser.findById.mockRejectedValue(gqlError);
    await expect(createStory(undefined, { input: validInput }))
      .rejects.toThrow(gqlError);
  });

  it('should handle when user is not found', async () => {
    mockedUser.findById.mockResolvedValue(null);
    mockedStory.create.mockResolvedValue(mockStory as any);

    const result = await createStory(undefined, { input: validInput });
    expect(result).toEqual(mockStory);
  });

  it('should handle special characters in image', async () => {
    const specialInput = { ...validInput, image: '!@#$%' };
    mockedUser.findById.mockResolvedValue(mockUser as any);
    const specialStory = { ...mockStory, image: '!@#$%' };
    mockedStory.create.mockResolvedValue(specialStory as any);

    const result = await createStory(undefined, { input: specialInput });
    expect(result.image).toBe('!@#$%');
  });

  it('should handle undefined input', async () => {
    await expect(createStory(undefined, { input: undefined as any }))
      .rejects.toThrow();
  });

  it('should handle null input', async () => {
    await expect(createStory(undefined, { input: null as any }))
      .rejects.toThrow();
  });
});