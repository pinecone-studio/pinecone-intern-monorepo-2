import { GraphQLResolveInfo } from 'graphql';
import { ArtistModel } from 'src/models';
import { getArtists } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  ArtistModel: {
    find: jest.fn(),
  },
}));
const mockdata = [
  {
    name: 'name',
    id: '683579fa8697af10c2662b41',
    avatarImage: 'http://sdjnsdvj',
  },
];
const name = 'name';
describe('getArtist', () => {
  const mockInfo = {} as GraphQLResolveInfo;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return artists include input name', async () => {
    (ArtistModel.find as jest.Mock).mockReturnValueOnce(mockdata);
    const result = await getArtists!({}, { name }, {}, mockInfo);
    expect(ArtistModel.find).toHaveBeenCalledWith({ name: { $regex: 'name', $options: 'i' } });
    expect(result).toEqual(mockdata);
  });
});
