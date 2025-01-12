/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateBook } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  BookModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'test',
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null),
      }),
  },
}));

describe('Update Book', () => {
  it('should update a book', async () => {
    const result = await updateBook!({}, { _id: '1', title: 'test', authorId: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'test',
    });
  });

  it("should throw an error if the book doesn't exist", async () => {
    try {
      await updateBook!({}, { _id: '1', title: 'test', authorId: '1' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Book not found'));
    }
  });
});
