import { addAmenity } from '../../../../src/resolvers/mutations/hotel/add-amenity';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  hotelsModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        hotelAmenities: ['free-wifi'],
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
}));
describe('createAmenity', () => {
  const input = {
    _id: '1',
    hotelAmenities: ['free-wifi'],
  };
  it('should create Amenity', async () => {
    const result = await addAmenity({}, { input });
    expect(result).toEqual({ _id: '1', hotelAmenities: ['free-wifi'] });
  });
  it('should be error', async () => {
    try {
      await addAmenity!({}, { input });
    } catch (err) {
      expect(err).toEqual(new GraphQLError((err as Error).message));
    }
  });
});
