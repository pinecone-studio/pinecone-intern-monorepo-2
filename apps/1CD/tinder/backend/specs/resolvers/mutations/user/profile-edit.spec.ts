import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { editProfile } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('submit birthday of user', () => {
  const mockId = 'fhsdbfchjbdsjcfbj';
  const mockName = 'Buyanzaya';
  const mockEmail = 'cypress@gmail.com';
  const mockBio = 'jhn dineg';
  const mockAge = 19;
  const mockInterests = 'Art';
  const mockProfession = 'finance';
  const mockSchoolWork = 'NUM';
  const mockAttraction = 'male';
  const mockUrl = 'kkk';
  const info = {} as GraphQLResolveInfo;

  const mockUser = {
    _id: mockId,
    name: mockName,
    email: mockEmail,
    bio: mockBio,
    age: mockAge,
    interests: [mockInterests],
    profession: mockProfession,
    schoolWork: [mockSchoolWork],
    attraction: mockAttraction,
    photos: [mockUrl],
  };

  it('should return updated user when update is successful', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await editProfile!({}, { input: mockUser }, { userId: mockId }, info);

    expect(result).toEqual(mockUser);
  });

  it('should throw an error when user is not found', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(editProfile!({}, { input: mockUser }, { userId: mockId }, info)).rejects.toThrow('Could not find user');
  });
});
