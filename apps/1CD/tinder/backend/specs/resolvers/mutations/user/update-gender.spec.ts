
import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { updateGender } from '../../../../src/resolvers/mutations/user/update-gender';


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
    const result = await updateGender!(
      {},
      {
        gender: 'Female',
      },
      {userId},
      {} as GraphQLResolveInfo
    );
    expect(result).toEqual({email:mockEmail});
  });

  it('should throw error', async () => {
    expect(updateGender!({}, { gender: '' }, {userId}, {} as GraphQLResolveInfo)).rejects.toThrow('Please enter or choose a gender.');
  });
});