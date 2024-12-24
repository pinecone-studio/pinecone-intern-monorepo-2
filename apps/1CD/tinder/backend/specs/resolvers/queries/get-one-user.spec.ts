import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../src/models';
import { getOneUser } from '../../../src/resolvers/queries';

jest.mock('../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
  },
}));

describe('Find one matched user', () => {
  const mockOneUserResponse = {
    _id: '6757b696595465df6d4fcc84',
    name: 'Sara',
    profession: 'Developer',
    age: 24
  };
  const input = {
    _id: '6757b696595465df6d4fcc84',
  };
  const userId = '6757b696595465df6d4fcc86';
  it('Get one matched user by id', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockOneUserResponse);

    expect(await getOneUser!({}, { input }, { userId }, {} as GraphQLResolveInfo)).toEqual(mockOneUserResponse);
  });

  it('It should throw error when internal server error occured', async () => {
    (userModel.findOne as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    await expect(getOneUser!({}, { input }, { userId }, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occured: Error: Internal server error'));
  });
});
