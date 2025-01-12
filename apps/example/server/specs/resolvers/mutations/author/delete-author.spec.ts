/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deleteAuthor } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    findByIdAndDelete: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        name: 'test',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('Delete Author', () => {
  it('should delete a author', async () => {
    const result = await deleteAuthor!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'test',
    });
  });

  it("should throw an error if the author doesn't exist", async () => {
    try {
      await deleteAuthor!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Author not found'));
    }
  });
});
