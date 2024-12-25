import { GraphQLResolveInfo } from 'graphql';

import { getHotels } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  hotelsModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([
        {
          _id: '1',
          hotelName: 'test',
        },
      ])
      .mockReturnValueOnce([]),
  },
}));

describe('get-hotels', () => {
  it('should return hotels', async () => {
    const response = await getHotels?.({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual([
      {
        _id: '1',
        hotelName: 'test',
      },
    ]);
  });
  it('should return hotels', async () => {
    try {
      await getHotels?.({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (err) {
      expect((err as Error).message).toEqual('Hotels not found');
    }
  });
});
