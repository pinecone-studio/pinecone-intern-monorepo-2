import { getEvents } from '../../../../src/resolvers/queries/event/get-events';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
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

describe('Get Events', () => {
  it('should return events', async () => {
    const result = await getEvents!({}, { filter: { q: 'rock' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]);
  });

  it('should return events', async () => {
    const result = await getEvents!({}, { filter: { date: '2024-11-28T18:00' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]);
  });

  it('should return events', async () => {
    const result = await getEvents!({}, { filter: { artist: 'rock' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]);
  });

  it('should return events', async () => {
    const result = await getEvents!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
      {
        _id: '2',
        name: '2',
      },
    ]);
  });
});
