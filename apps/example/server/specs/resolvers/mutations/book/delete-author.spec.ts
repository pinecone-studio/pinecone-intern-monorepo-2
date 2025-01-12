/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deleteBook } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  BookModel: {
    findByIdAndDelete: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          _id: '1',
          title: 'test',
          author: {
            _id: '1',
            name: 'test',
          },
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null),
      }),
  },
}));

describe('Delete Book', () => {
  it('should delete a book', async () => {
    const result = await deleteBook!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      title: 'test',
      author: {
        _id: '1',
        name: 'test',
      },
    });
  });

  it("should throw an error if the book doesn't exist", async () => {
    try {
      await deleteBook!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Book not found'));
    }
  });
});
