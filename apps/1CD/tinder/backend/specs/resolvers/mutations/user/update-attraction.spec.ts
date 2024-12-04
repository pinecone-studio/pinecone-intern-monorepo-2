import { updateAttraction } from '../../../../src/resolvers/mutations';
import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('update attraction', () => {
  const mockUser = {
    _id: '123',
    name: 'Sara',
    bio: 'Traveler',
    interests: ['Reading', 'Traveling'],
    profession: 'Developer',
    schoolWork: ['School', 'Work'],
    attraction: 'male',
  };

  const updatedAttraction = {
    ...mockUser,
    attraction: 'female',
  };

  it('should update attraction', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedAttraction);
    const result = await updateAttraction!(
      {},
      {
        _id: '123',
        attraction: 'female',
      },
      {},
      {} as GraphQLResolveInfo
    );
    expect(result).toEqual(updatedAttraction);
  });
  it('should throw error', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(null);

    expect(updateAttraction!({}, { _id: '123', attraction: 'female' }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('not find user');
  });
});
