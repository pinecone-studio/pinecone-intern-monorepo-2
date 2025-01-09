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
  roomsModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([
        {
          _id: '1',
          roomType: '1bed',
        },
      ])
      .mockReturnValueOnce([
        {
          _id: '1',
          roomType: '1bed',
        },
      ]),
  },
}));

describe('get-hotels', () => {
  const input = {
    userRating: 6,
    starRating: 10,
    hotelName: 'test',
    roomType: '1bed',
  };
  it('should return hotels', async () => {
    const response = await getHotels?.({}, { input }, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual([
      {
        _id: '1',
        hotelName: 'test',
      },
    ]);
  });
  it('should return hotels', async () => {
    try {
      await getHotels?.({}, { input: { roomType: '' } }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (err) {
      expect((err as Error).message).toEqual('Hotels not found');
    }
  });
});
