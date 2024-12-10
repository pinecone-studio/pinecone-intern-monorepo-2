import { GraphQLResolveInfo } from "graphql";
import { getRooms } from "src/resolvers/queries/rooms/get-room-data";

jest.mock('src/models', ()=>({
    roomsModel:{
        find: jest
        .fn()
        .mockReturnValueOnce({
            _id: '1',
            roomName: 'test',
        })
        .mockReturnValueOnce(null),
    },
}));
describe('get-rooms', () => {
    it('should return room', async () => {
      const response = await getRooms!({}, { hotelId: '1' }, {userId:"1"},{} as GraphQLResolveInfo);
      expect(response).toEqual({
        _id: '1',
        roomName: 'test',
      });
    });
    it('should return null', async () => {
      try {
        await getRooms!({}, { hotelId: '1' }, {userId: "1"}, {} as GraphQLResolveInfo);
      } catch (err) {
        expect((err as Error).message).toEqual('Rooms not found');
      }
    });
  });