import { updateEventHigh } from '../../../../src/resolvers/mutations/event/update-event-high';
import Event from '../../../../src/models/event.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findByIdAndUpdate: jest.fn(),
}));

describe('update priority of the event', () => {
  it('should update priority of the event', async () => {
    (Event.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      priority: 'test',
    });
    const result = await updateEventHigh!({}, { eventId: '1' }, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      message: 'success',
    });
  });
  it('should update priority of the event', async () => {
    (Event.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    try {
      await updateEventHigh!({}, { eventId: '1' }, { userId: '2' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Event not found'));
    }
  });
});
