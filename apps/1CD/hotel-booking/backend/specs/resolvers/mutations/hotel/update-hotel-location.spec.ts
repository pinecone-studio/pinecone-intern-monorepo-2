import { GraphQLResolveInfo } from 'graphql';
import { updateHotelLocation } from '../../../../src/resolvers/mutations/hotel/update-hotel-location';

jest.mock('../../../../src/models', () => ({
  hotelsModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        id: '1',
        location: 'test',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('updateHotelLocation', () => {
  it('should update location', async () => {
    const result = await updateHotelLocation!({}, { _id: '1', location: 'test' }, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(result).toEqual({ id: '1', location: 'test' });
  });
  it('should be id null', async () => {
    try {
      await updateHotelLocation!({}, { _id: '0', location: 'test' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (err) {
      expect(err).toEqual(new Error('Error to update location'));
    }
  });
});
