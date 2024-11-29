
import { RoomServiceInput } from "../../../../src/generated";
import { addRoomService } from "../../../../src/resolvers/mutations";


jest.mock('apps/1CD/hotel-booking/backend/src/models', () => ({
    roomsModel: {
        findByIdAndUpdate: jest
        .fn()
        .mockResolvedValueOnce({
            id: '674851d9066230f0d7f74866',
        })
        .mockRejectedValueOnce(new Error('Error')),
    }
}))

describe('add room services', () => {
    const roomId = "1"
    const input : RoomServiceInput = {
        bathroom: ["bathrobes","toiletries"],
        accessability: ["thin carpet in room"],
        entertaiment: ["cable channels","Tv"],
        foodDrink: ['electric kettle'],
        bedroom: ['air conditioning','bed sheets'],
        other: ['Desk', 'phone', 'safe']

    };
    it ('if successfully added room services', async () => {
        const result = await addRoomService({}, { input, roomId});
        expect(result).toEqual({
            id: '674851d9066230f0d7f74866'
        })
    })
     it ('if failed to add room services', async() => {
        try {
            await addRoomService({}, { input,roomId })
        } catch (error) {
            expect ((error as Error).message).toBe('Error')
        }
     })
})