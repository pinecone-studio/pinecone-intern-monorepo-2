/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getAuthor } from '../../../../src/graphql/resolvers/queries';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        name: 'F. Scott Fitzgerald',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('Get Author', () => {
  it('should return a author', async () => {
    const result = await getAuthor!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'F. Scott Fitzgerald',
    });
  });

  it("should throw an error if the author doesn't exist", async () => {
    try {
      await getAuthor!({}, { _id: '1' }, {}, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Author not found'));
    }
  });
});
