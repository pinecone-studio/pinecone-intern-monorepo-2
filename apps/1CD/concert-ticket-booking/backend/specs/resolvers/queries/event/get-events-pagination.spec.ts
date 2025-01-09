import { getEventsPaged } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/event.model', () => ({
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
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
  countDocuments: jest.fn().mockReturnValue(10),
}));

describe('Get Events', () => {
  it('should return events with total pages', async () => {
    const result = await getEventsPaged!({}, { filter: { q: 'rock' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      events: [
        {
          _id: '1',
          name: 'test-name',
        },
        {
          _id: '2',
          name: '2',
        },
      ],
      totalPages: 2,
    });
  });

  it('should return events with total pages', async () => {
    const result = await getEventsPaged!({}, { filter: { date: '2024-11-28T18:00' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      events: [
        {
          _id: '1',
          name: 'test-name',
        },
        {
          _id: '2',
          name: '2',
        },
      ],
      totalPages: 2,
    });
  });

  it('should return events with total pages', async () => {
    const result = await getEventsPaged!({}, { filter: { artist: 'rock' } }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      events: [
        {
          _id: '1',
          name: 'test-name',
        },
        {
          _id: '2',
          name: '2',
        },
      ],
      totalPages: 2,
    });
  });

  it('should return events with total pages', async () => {
    const result = await getEventsPaged!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      events: [
        {
          _id: '1',
          name: 'test-name',
        },
        {
          _id: '2',
          name: '2',
        },
      ],
      totalPages: 2,
    });
  });
});
