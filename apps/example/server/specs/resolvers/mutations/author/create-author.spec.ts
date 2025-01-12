/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createAuthor } from '../../../../src/graphql/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  AuthorModel: {
    create: jest.fn().mockReturnValue({
      _id: '1',
      name: 'test',
    }),
  },
}));

describe('Create Author', () => {
  it('should create a author', async () => {
    const result = await createAuthor!({}, { name: 'test' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      name: 'test',
    });
  });
});
