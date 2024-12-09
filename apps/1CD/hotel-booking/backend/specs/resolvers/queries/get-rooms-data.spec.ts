import { GraphQLResolveInfo } from "graphql";
import { getRooms } from "src/resolvers/queries";

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
}));

describe('get-Rooms', () => {
    it('should get room by id', async () => {
        const response = await getRooms!({}, {hotelId: '2'}, { userId: '1' }, {} as GraphQLResolveInfo);
        expect(response).toEqual([
            {
                _id: '1',
                roomName: 'test',
            },
        ]);
    });
    it('should not get room by id', async () => {
        try {
            await getRooms!({}, {hotelId: '2'}, { userId: '1' }, {} as GraphQLResolveInfo);
        } catch (error) {
            expect((error as Error).message).toEqual('Rooms not found');
        }
    });
});