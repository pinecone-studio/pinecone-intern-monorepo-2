/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getBooks } from '../../../../src/graphql/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  BookModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: '1',
          title: 'The Great Gatsby',
        },
      ]),
    }),
  },
}));

describe('Get Books', () => {
  it('should return a books', async () => {
    const result = await getBooks!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual([
      {
        _id: '1',
        title: 'The Great Gatsby',
      },
    ]);
  });
});
