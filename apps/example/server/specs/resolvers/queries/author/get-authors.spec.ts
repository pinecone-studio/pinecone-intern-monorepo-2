/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getAuthors } from '../../../../src/graphql/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    find: jest.fn().mockResolvedValue([
      {
        _id: '1',
        name: 'F. Scott Fitzgerald',
      },
    ]),
  },
}));

describe('Get Authors', () => {
  it('should return a authors', async () => {
    const result = await getAuthors!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual([
      {
        _id: '1',
        name: 'F. Scott Fitzgerald',
      },
    ]);
  });
});
