import { getEventById } from '../../../../src/resolvers/queries/event/get-event';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findById: jest
    .fn()
    .mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce({ _id: '1', name: 'test-name' }),
    })
    .mockReturnValueOnce({ populate: jest.fn().mockReturnValueOnce(null) }),
}));

describe('Get Event By Id', () => {
  it('should return an event', async () => {
    const result = await getEventById!({}, { _id: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({ _id: '1', name: 'test-name' });
  });

  it("should throw an error if the event doesn't exist", async () => {
    try {
      await getEventById!({}, { _id: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Event not found'));
    }
  });
});
