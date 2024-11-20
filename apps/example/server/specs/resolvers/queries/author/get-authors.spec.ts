/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getAuthors, getAuthorsByName } from '../../../../src/graphql/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([
        {
          _id: '1',
          name: 'F. Scott Fitzgerald',
        },
      ])
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue([]),
      })
      .mockReturnValueOnce(
        [{ _id: '2', name: 'Doe' }]
      ),
  },
}));

describe('Get Authors', () => {
  it('should return a list of authors', async () => {
    const result = await getAuthors!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual([
      {
        _id: '1',
        name: 'F. Scott Fitzgerald',
      },
    ]);
  });

  it('should throw an error when no authors are found', async () => {
    try {
      await getAuthorsByName!({}, { name: 'Wahahahaha' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('Not found'));
    }
  });

  it('should return a list of authors with the given name', async () => {
    const result = await getAuthorsByName!({}, { name: 'Doe' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual([{ _id: '2', name: 'Doe' }]);
  });
});
