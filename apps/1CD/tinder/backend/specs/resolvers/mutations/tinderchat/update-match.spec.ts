import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Matchmodel } from '../../../../src/models';
import { updateMatch } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  Matchmodel: {
    updateOne: jest.fn(),
  },
}));

describe('Unmatch', () => {
  const MatchmodelResponse = {
    matched: false,
  };
  it('should create a new chat and message when previously has not chatted', async () => {
    (Matchmodel.updateOne as jest.Mock).mockResolvedValue(MatchmodelResponse);

    const input = {
      user1: '6747bf86eef691c549c23464',
    };
    const userId = '6747bf86eef691c549c23464';
    const user1 = input.user1;
    const user2 = userId;
    const updatedmatch = await updateMatch!({}, { input }, { userId }, {} as GraphQLResolveInfo);

    expect(Matchmodel.updateOne).toHaveBeenCalledWith(
      {
        $or: [
          { user1: user1, user2: user2 },
          { user2: user1, user1: user2 },
        ],
      },
      {
        $set: { matched: false },
      }
    );

    expect(updatedmatch).toEqual(MatchmodelResponse);
  });
  it('should throw an error when there is an internal server error', async () => {
    (Matchmodel.updateOne as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    const userId ='6747bf86eef691c549c23464'
    const input = {
        user1: '6747bf86eef691c549c23464',
      };
    await expect(updateMatch!({}, { input }, {userId}, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occured: Error: Internal server error'));
  });
});
