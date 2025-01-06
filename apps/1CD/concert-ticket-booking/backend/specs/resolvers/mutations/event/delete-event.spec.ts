import { deleteEvent } from '../../../../src/resolvers/mutations/event/delete-event';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findByIdAndUpdate: jest.fn().mockResolvedValueOnce({ message: 'success' }).mockResolvedValueOnce(null),
}));

describe('Delete Event', () => {
  it('should delete an event', async () => {
    const result = await deleteEvent!({}, { _id: '1' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      message: 'success',
    });
  });

  it("should throw an error if the event doesn't exist", async () => {
    try {
      await deleteEvent!({}, { _id: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('error found'));
    }
  });
});
