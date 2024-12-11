import { GraphQLResolveInfo } from "graphql";
import { hotelService } from "src/resolvers/queries/rooms/hotel-service";

jest.mock('src/models', ()=>({
    roomsModel:{
        find: jest
        .fn()
        .mockReturnValueOnce({
            _id: '1',
        })
        .mockReturnValueOnce(null),
    },
}));
describe('get-rooms-service', () => {
    it('should return room', async () => {
      const response = await hotelService!({},{roomId:"1"},{userId:"1"},{} as GraphQLResolveInfo);
      expect(response).toEqual({
        _id: '1',
      });
    });
    it('should return null', async () => {
      try {
        await hotelService!({},{roomId:"1"},{userId:"1"},{} as GraphQLResolveInfo);
      } catch (err) {
        expect((err as Error).message).toEqual('Rooms not found');
      }
    });
  });