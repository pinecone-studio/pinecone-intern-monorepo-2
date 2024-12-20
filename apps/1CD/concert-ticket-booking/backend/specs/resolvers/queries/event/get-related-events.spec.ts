import { getRelatedEvents } from '../../../../src/resolvers/queries/event/get-related-events';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findById: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      _id: '1',
      name: 'test-name',
      category: ['music', 'sports'],
      scheduledDays: ['2024-12-25'],
      products: [],
      venue: {},
    }),
  }),
  find: jest.fn().mockReturnValue({
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnValue([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]),
  }),
}));

describe('Get Related Events', () => {
  it('should return event details and related events', async () => {
    const result = await getRelatedEvents!({}, { eventId: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result.eventDetail).toEqual({
      _id: '1',
      name: 'test-name',
      category: ['music', 'sports'],
      scheduledDays: ['2024-12-25'],
      products: [],
      venue: {},
    });
    expect(result.relatedEvents).toEqual([
      { _id: '1', name: 'test-name' },
      { _id: '2', name: '2' },
    ]);
  });
});
