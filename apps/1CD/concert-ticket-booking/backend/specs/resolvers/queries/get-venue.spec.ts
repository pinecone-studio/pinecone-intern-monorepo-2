import { GraphQLResolveInfo } from 'graphql';
import { getArena } from '../../../src/resolvers/queries/get-venue';
import Venue from '../../../src/models/venue.model';

jest.mock('../../../src/models/venue.model', () => ({
  find: jest.fn(),
}));

describe('getArena', () => {
  it('should get arena', async () => {
    (Venue.find as jest.Mock).mockResolvedValueOnce([]);
    const response = await getArena!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    expect(response).toEqual([]);
  });
});
