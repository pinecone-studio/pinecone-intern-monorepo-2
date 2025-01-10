import { updateHotelGeneralInfo } from 'src/resolvers/mutations';
import { HotelInput } from '../../../../src/generated';

jest.mock('src/models', () => ({
  hotelsModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      _id: '1',
      hotelName: 'badral',
      description: 'test',
    }),
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
    const result = await updateHotelGeneralInfo({}, { _id: '1', input });
    expect(result).toEqual({
      _id: '1',
      hotelName: 'badral',
      description: 'test',
    });
  });
  it('if unsuccesfully create hotel general info', async () => {
    try {
      await updateHotelGeneralInfo({}, { _id: '', input });
    } catch (err) {
      expect((err as Error).message).toEqual('id must required');
    }
  });
});
