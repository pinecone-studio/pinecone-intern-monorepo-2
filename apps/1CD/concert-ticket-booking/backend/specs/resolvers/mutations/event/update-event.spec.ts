import { updateEvent } from '../../../../src/resolvers/mutations/event/update-event';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  findOneAndUpdate: jest.fn().mockReturnValue({
    _id: '1',
    name: 'Big Gee',
  }),
}));

describe('update events', () => {
  it('should update an event', async () => {
    const result = await updateEvent!({}, { _id: '1', event: { name: 'Big Gee' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({ _id: '1', name: 'Big Gee' });
  });
});
