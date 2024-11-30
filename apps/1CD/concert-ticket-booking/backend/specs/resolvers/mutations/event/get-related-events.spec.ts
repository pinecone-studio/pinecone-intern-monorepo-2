import { getRelatedEvents } from '../../../../src/resolvers/queries/event/get-related-events';
import Event from '../../../../src/models/event.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findById: jest.fn(),
  find: jest.fn(),
}));

describe('getRelated events with event detail', () => {
  it('should handle errors when event not found', async () => {
    (Event.findById as jest.Mock).mockResolvedValueOnce(null);

    try {
      await getRelatedEvents!({}, { eventId: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Event not found')); // Optional: validate the message
    }
  });

  it('should get current event and related events', async () => {
    // Mocking the event details returned by findById
    (Event.findById as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      name: 'Test Event',
      category: ['category1'],
      scheduledDays: ['2024-12-01T11:09:18.393Z'],
    });

    // Mocking the related events query
    (Event.find as jest.Mock).mockResolvedValueOnce([
      {
        _id: '2',
        name: 'Related Event 1',
        scheduledDays: ['2024-12-02T11:09:18.393Z'],
      },
      {
        _id: '3',
        name: 'Related Event 2',
        scheduledDays: ['2024-12-03T11:09:18.393Z'],
      },
    ]);

    const result = await getRelatedEvents!({}, { eventId: '1' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result.eventDetail).toEqual({
      _id: '1',
      name: 'Test Event',
      category: ['category1'],
      scheduledDays: ['2024-12-01T11:09:18.393Z'],
    });
    expect(result.relatedEvents).toEqual([
      {
        _id: '2',
        name: 'Related Event 1',
        scheduledDays: ['2024-12-02T11:09:18.393Z'],
      },
      {
        _id: '3',
        name: 'Related Event 2',
        scheduledDays: ['2024-12-03T11:09:18.393Z'],
      },
    ]);
  });
});
