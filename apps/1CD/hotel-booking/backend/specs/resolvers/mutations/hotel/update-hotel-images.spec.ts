import { GraphQLResolveInfo } from 'graphql';
import { updateHotelImages } from 'src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  hotelsModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        id: '1',
        images: ['test'],
      })
      .mockReturnValueOnce(null),
  },
}));

describe('updateHotelImages', () => {
  it('should update Images', async () => {
    const result = await updateHotelImages!({}, { _id: '1', images: ['das'] }, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(result).toEqual({ id: '1', images: ['test'] });
  });
  it('should be id null', async () => {
    try {
      await updateHotelImages!({}, { _id: '0', images: ['test'] }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (err) {
      expect(err).toEqual(new Error('Error to update Image'));
    }
  });
});
