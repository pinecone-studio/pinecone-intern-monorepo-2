import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../src/models/user/user.model';
import { getMe } from '../../../src/resolvers/queries/get-me';


jest.mock('../../../src/models/user/user.model', () => ({
  userModel: {
    findById: jest.fn(),
  },
}));

describe('give user details', () => {
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
    gender:'male',
    interests: [mockInterests],
    profession: mockProfession,
    schoolWork: [mockSchoolWork],
    attraction: mockAttraction,
    photos: [mockUrl],
  };

  it('should return user details', async () => {

    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    const result = await getMe!({}, {}, { userId: mockId }, info);
    expect(result).toEqual(mockUser);
  });

  
});
