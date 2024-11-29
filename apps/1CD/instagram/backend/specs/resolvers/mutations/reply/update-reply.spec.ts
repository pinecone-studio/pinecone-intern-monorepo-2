/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateReply} from '../../../../src/resolvers/mutations';


jest.mock('../../../../src/models/reply.model.ts', () => ({
  ReplyModel: {
    findbyIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        userID: "1",     
        description:"s",
        comment:"a231"
      })
      .mockResolvedValueOnce(null),
  },
}));
// const input = { 
//   userID: "1",     
//   description:"s",
//   comment:"a231"};


describe('update Reply', () => {
  it('should update a reply', async () => {
    const result = await updateReply!(
      {},
      {
        userID: "1",     
        // description:"s",
        // comment:"a231"
      },
      {},
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual(
       {
        userID: "1",     
        description:"s",
        comment:"a231"
        
       
    });
  });
  it('should throw a post', async () => {
    try {
      await updateReply!(
        {},
        {
          userID: "1",     
          // description:"s",
          // comment:"a231"
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not updated reply'));
    }
  });

});