import { GraphQLResolveInfo } from 'graphql';
import { ArtistModel } from 'src/models';
import { getArtists } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  ArtistModel: {
    find: jest.fn(),
  },
}));

const mockDataSingle = [
  {
    name: 'name',
    id: '683579fa8697af10c2662b41',
    avatarImage: 'http://sdjnsdvj',
  },
];

const mockDataAll = [
  ...mockDataSingle,
  {
    name: 'asdsad',
    id: '683579fa8697af10c2662b41',
    avatarImage: 'http://sdjnsdvj',
  },
];

const mockInfo = {} as GraphQLResolveInfo;

describe('getArtists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return artists matching the input name', async () => {
    (ArtistModel.find as jest.Mock).mockResolvedValueOnce(mockDataSingle);

    const result = await getArtists!({}, { name: 'name' }, {}, mockInfo);

    expect(ArtistModel.find).toHaveBeenCalledWith({ name: { $regex: 'name', $options: 'i' } });
    expect(result).toEqual(mockDataSingle);
  });

  it('should return all artists if name is empty', async () => {
    (ArtistModel.find as jest.Mock).mockResolvedValueOnce(mockDataAll);

    const result = await getArtists!({}, { name: '' }, {}, mockInfo);

    expect(ArtistModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockDataAll);
  });
});
