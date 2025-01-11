import { GraphQLResolveInfo } from 'graphql';
import { hotelDetail } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([
        {
          _id: '1',
          roomName: 'test',
        },
      ])
      .mockReturnValueOnce([]),
  },
  bookingModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([])
      .mockReturnValueOnce([{ roomId: '1' }]),
  },
}));
describe('get-rooms', () => {
  const input = {
    roomType: 'test',
    checkInDate: '2024-12-10',
    checkOutDate: '2025-12-15',
  };
  it('should return room', async () => {
    const response = await hotelDetail!(
      {},
      {
        hotelId: '1',
        input: {
          ...input,
          roomType: '',
        },
      },
      { userId: '1' },
      {} as GraphQLResolveInfo
    );
    expect(response).toEqual([
      {
        _id: '1',
        roomName: 'test',
      },
    ]);
  });
  it('should return null', async () => {
    try {
      await hotelDetail!({}, { hotelId: '1', input }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (err) {
      expect((err as Error).message).toEqual('Rooms not found');
    }
  });
});
