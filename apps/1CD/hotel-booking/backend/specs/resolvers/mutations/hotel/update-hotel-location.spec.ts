import { updateHotelLocation } from '../../../../src/resolvers/mutations/hotel/update-hotel-location';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models', () => ({
  hotelsModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        location: 'test',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('updateHotelLocation', () => {
  it('should update location', async () => {
    const result = await updateHotelLocation!({}, { _id: '1', location: 'test' }, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual({ _id: '1', location: 'test' });
  });
  it('should be id null', async () => {
    try {
      await updateHotelLocation!({}, { _id: '0', location: 'test' }, {}, {} as GraphQLResolveInfo);
    } catch (err) {
      expect((err as Error).message).toEqual('Error to update location');
    }
  });
});
