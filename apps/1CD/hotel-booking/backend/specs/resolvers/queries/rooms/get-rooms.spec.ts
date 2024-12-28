import { getRooms } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce([
            {
              _id: '1',
              roomCount: 5,
            },
          ]),
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce([
            {
              _id: '1',
              roomCount: 5,
            },
          ]),
        }),
      }),
  },
  bookingModel: {
    find: jest
      .fn()
      .mockResolvedValueOnce([
        {
          checkInDate: '2024-12-08',
          checkOutDate: '2024-12-12',
        },
      ])

      .mockResolvedValueOnce([]),
  },
  hotelsModel: {
    find: jest
      .fn()
      .mockResolvedValueOnce([
        {
          _id: '1',
          hotelName: 'test',
        },
      ])
      .mockResolvedValueOnce([]),
  },
}));

describe('get rooms', () => {
  it('if succussfylly worked', async () => {
    const result = await getRooms(
      {},
      {
        input: {
          checkInDate: '2024-12-08',
          checkOutDate: '2024-12-12',
          starRating: 4,
          userRating: 4,
          hotelAmenities: ['a'],
          hotelName: 'test',
          price: 1,
          roomType: '1bed',
        },
      }
    );
    expect(result).toEqual([
      {
        _id: '1',
        roomCount: 5,
      },
    ]);
  });
  it('if succussfylly worked', async () => {
    const result = await getRooms(
      {},
      {
        input: {
          checkInDate: '2024-12-08',
          checkOutDate: '2024-12-12',
          starRating: 4,
          userRating: 4,
          hotelAmenities: ['a'],
          hotelName: 'flower',
          price: 1,
          roomType: '1bed',
        },
      }
    );
    expect(result).toEqual([]);
  });
});
