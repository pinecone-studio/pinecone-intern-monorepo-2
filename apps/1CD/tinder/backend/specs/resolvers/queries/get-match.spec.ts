import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import { getMatch } from '../../../src/resolvers/queries';
import { Chatmodel, Matchmodel, userModel } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Matchmodel: {
    find: jest.fn(),
  },
  userModel: {
    find: jest.fn(),
  },
  Chatmodel: {
    find: jest.fn(),
  },
}));

describe('Get matched users', () => {
  const mockMatchedUserResponse = {
    toObject: jest.fn().mockReturnValue({
        _id: '6757b696595465df6d4fcc80',
        name: 'Sara',
        profession: 'Developer',
        age: 24
      })
    }
  const finalMatchedUserResponse = {
     _id: '6757b696595465df6d4fcc80',
      name: 'Sara',
      profession: 'Developer',
      age: 24,
      hasChatted:false
  }
  const mockMatchResponse = {
    _id: '6757b696595465df6d4fcc78',
    user1: '6757b696595465df6d4fcc85',
    user2: '6757b696595465df6d4fcc84',
    matched: true,
  };
  const mockChatResponse = {
    _id: '6747bf86eef691c549c23463',
    participants: ['6757b696595465df6d4fcc86', '6757b696595465df6d4fcc84'],
  };
  const userId = '6757b696595465df6d4fcc86';
  it('If users have not previously matched it should throw error', async () => {
    (Matchmodel.find as jest.Mock).mockResolvedValue(null);
    await expect(getMatch!({}, {}, { userId }, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occurred: No matches found'));
    expect(Matchmodel.find).toHaveBeenCalledWith({
      $or: [{ user1: userId }, { user2: userId }],
      matched: true,
    });
  });

  it('If users have previously matched it should return matched users with chat status', async () => {
    (Matchmodel.find as jest.Mock).mockResolvedValue([mockMatchResponse]);
    (userModel.find as jest.Mock).mockResolvedValue([mockMatchedUserResponse]);
    (Chatmodel.find as jest.Mock).mockResolvedValue([mockChatResponse]);
    expect(await getMatch!({}, {}, { userId }, {} as GraphQLResolveInfo)).toEqual([finalMatchedUserResponse]);
  });

  it('It should throw error when internal server error occured', async () => {
    (Matchmodel.find as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    await expect(getMatch!({}, {}, { userId }, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occurred: Error: Internal server error'));
  });
});
