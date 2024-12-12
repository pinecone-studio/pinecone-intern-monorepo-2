import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { birthdaySubmit } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('submit birthday of user', () => {
  const mockEmail = 'test@gmail.com';
  const mockAge = 18;
  const info = {} as GraphQLResolveInfo;

  it('should return updated user when update is successful', async () => {
    const mockUser = {
      email: mockEmail,
      age: mockAge,
    };

    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const result = await birthdaySubmit!({}, { input: { email: mockEmail, age: mockAge } }, {}, info);
    expect(result).toEqual({ email: mockUser.email });
  });

  it('should throw an error when user is not found', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(birthdaySubmit!({}, { input: { email: mockEmail, age: mockAge } }, {}, info)).rejects.toThrow('Could not find user');
  });
});
