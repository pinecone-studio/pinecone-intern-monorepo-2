/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateAuthor } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        name: 'test',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('Update Author', () => {
  it('should update a author', async () => {
    const result = await updateAuthor!({}, { _id: '1', name: 'test' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'test',
    });
  });

  it("should throw an error if the author doesn't exist", async () => {
    try {
      await updateAuthor!({}, { _id: '1', name: 'test' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Author not found'));
    }
  });
});
