import { getRelatedEvents } from '../../../../src/resolvers/queries/event/get-related-events';
import Event from '../../../../src/models/event.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findById: jest.fn(),
  find: jest.fn().mockReturnThis(), // Mocking the query object to support chaining
}));

describe('getRelated events with event detail', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle errors when event not found', async () => {
    (Event.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(getRelatedEvents!({}, { eventId: '1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrowError(new Error('Event not found'));
  });

  it('should get current event and related events', async () => {
    // Mocking the event details returned by findById
    (Event.findById as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      name: 'Test Event',
      category: ['category1'],
      scheduledDays: ['2024-12-01T11:09:18.393Z'],
    });

    // Mocking the related events query (with .limit(6) support)
    (Event.find as jest.Mock).mockReturnValue({
      limit: jest.fn().mockReturnValue([
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
      ]),
    });

    const result = await getRelatedEvents!({}, { eventId: '1' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result.eventDetail).toEqual({
      _id: '1',
      name: 'Test Event',
      category: ['category1'],
      scheduledDays: ['2024-12-01T11:09:18.393Z'],
    });
    expect(result.relatedEvents).toHaveLength(2); // Adjusted to 2 based on mock
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
