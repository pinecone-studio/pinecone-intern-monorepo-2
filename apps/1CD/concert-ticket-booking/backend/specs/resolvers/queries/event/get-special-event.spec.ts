import { GraphQLResolveInfo } from 'graphql';
import Event from '../../../../src/models/event.model';
import { getSpecialEvent } from '../../../../src/resolvers/queries/event/get-special-events';

jest.mock('../../../../src/models/event.model', () => ({
  find: jest.fn(),
}));

describe('getSpecialEvent', () => {
  it('should return high-priority events', async () => {
    const mockEvents = [{ id: 1, name: 'Event 1', priority: 'high' }];
    (Event.find as jest.Mock).mockResolvedValue(mockEvents);
    const mockContext = { userId: '12345' };
    const result = await getSpecialEvent!({}, {}, mockContext, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockEvents);
  });
});
