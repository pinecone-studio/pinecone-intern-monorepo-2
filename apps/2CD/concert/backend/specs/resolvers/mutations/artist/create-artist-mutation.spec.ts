import { GraphQLResolveInfo } from 'graphql';
import { Response } from 'src/generated';
import { ArtistModel } from 'src/models/artist.model';
import { createArtist } from 'src/resolvers/mutations';
import { artistSchema } from 'src/zodSchemas/artist.zod';

const mockInput = {
  name: 'artist1',
  avatarImage: 'https://example/image.jpg',
};

jest.mock('src/models/artist.model', () => ({
  ArtistModel: {
    create: jest.fn(),
  },
}));
describe('createArtist', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw error if name is empty', () => {
    const badInput = { ...mockInput, name: '' };
    expect(() => artistSchema.parse(badInput)).toThrow('artist name is required');
  });
  it('should throw error if avatar image is not url', () => {
    const badInput = { ...mockInput, avatarImage: 'not-a-url' };
    expect(() => artistSchema.parse(badInput)).toThrow('Thumbnail URL must be a valid URL');
  });
  it('should create artist succesful', async () => {
    (ArtistModel.create as jest.Mock).mockResolvedValueOnce({ _id: 'artistId' });
    const result = await createArtist!({}, { input: mockInput }, {}, mockInfo);
    expect(ArtistModel.create).toHaveBeenCalled()
    expect(result).toBe(Response.Success);
  });
});
