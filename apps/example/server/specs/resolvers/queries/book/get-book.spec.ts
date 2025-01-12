/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getBook } from '../../../../src/graphql/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  BookModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          _id: '1',
          title: 'The Great Gatsby',
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null),
      }),
  },
}));

describe('Get Book', () => {
  it('should return a book', async () => {
    const result = await getBook!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      title: 'The Great Gatsby',
    });
  });

  it("should throw an error if the book doesn't exist", async () => {
    try {
      await getBook!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Book not found'));
    }
  });
});
