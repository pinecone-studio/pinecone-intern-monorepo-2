/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createBook } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  BookModel: {
    create: jest.fn().mockResolvedValue({
      populate: jest.fn().mockResolvedValue({
        _id: '1',
        title: 'test',
        author: {
          _id: '1',
          name: 'test',
        },
      }),
    }),
  },
}));

describe('Create Book', () => {
  it('should create a book', async () => {
    const result = await createBook!({}, { title: 'test', authorId: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      title: 'test',
      author: {
        _id: '1',
        name: 'test',
      },
    });
  });
});
