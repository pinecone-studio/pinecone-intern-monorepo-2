import { deleteEvent } from '../../../../src/resolvers/mutations/event/delete-event';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findOneAndDelete: jest.fn().mockResolvedValueOnce({ _id: '1', name: 'test-name' }).mockResolvedValueOnce(null),
}));

describe('Delete Event', () => {
  it('should delete an event', async () => {
    const result = await deleteEvent!({}, { _id: '507f1f77bcf86cd799439011' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'test-name',
    });
  });

  it("should throw an error if the event doesn't exist", async () => {
    try {
      await deleteEvent!({}, { _id: '507f1f77bcf86cd799439011' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Event not found'));
    }
  });
});
