import { HotelInput } from '../../../../src/generated';
import { addHotelGeneralInfo } from '../../../../src/resolvers/mutations/hotel/add-hotel-general-info';

jest.mock('src/models', () => ({
  hotelsModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        hotelName: 'badral',
        description: 'test',
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
}));

describe('create hotel general info', () => {
  const input: HotelInput = {
    phoneNumber: 8080808,
    hotelName: 'badral',
    description: 'test',
    starRating: 5,
    userRating: 4,
  };
  it('if succesfully created hotel general info', async () => {
    const result = await addHotelGeneralInfo({}, { input });
    expect(result).toEqual({
      _id: '1',
      hotelName: 'badral',
      description: 'test',
    });
  });
  it('if unsuccesfully create hotel general info', async () => {
    try {
      await addHotelGeneralInfo({}, { input });
    } catch (err) {
      expect((err as Error).message).toBe('Error');
    }
  });
});
