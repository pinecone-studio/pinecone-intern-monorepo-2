/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateReply} from '../../../../src/resolvers/mutations';


jest.mock('../../../../src/models/reply.model.ts', () => ({
  ReplyModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
       _id:"123" ,    
        description:"s",
       
      })
      .mockResolvedValueOnce(null),
  },
}));
const input = { 
  _id:"123" ,    
  description:"s",
};


describe('update Reply', () => {
  it('should update a reply', async () => {
    const result = await updateReply!(
      {},
      {
       input
      },
      {userId: null},
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual(
       {
        _id:"123" ,    
        description:"s",
        
       
    });
  });
  it('should throw a post', async () => {
    try {
      await updateReply!(
        {},
        {
        input
        },
        {userId: null},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not updated reply'));
    }
  });

});