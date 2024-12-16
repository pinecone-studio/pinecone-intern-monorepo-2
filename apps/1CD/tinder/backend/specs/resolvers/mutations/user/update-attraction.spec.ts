import { updateAttraction } from '../../../../src/resolvers/mutations';
import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';


jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('update attraction', () => {
  const mockEmail = 'cypress@gmail.com';
const userId='675675e84bd85fce3de34006'

  it('should update attraction', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue({email:mockEmail});
    const result = await updateAttraction!(
      {},
      {
        attraction: 'female',
      },
      {userId},
      {} as GraphQLResolveInfo
    );
    expect(result).toEqual({email:mockEmail});
  });
  
  it('should throw error', async () => {
    expect(updateAttraction!({}, { attraction: '' }, {userId}, {} as GraphQLResolveInfo)).rejects.toThrow('Please enter or choose an attraction.');
  });
});
