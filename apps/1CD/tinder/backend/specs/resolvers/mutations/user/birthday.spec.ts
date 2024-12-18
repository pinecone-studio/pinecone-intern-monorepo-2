import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { birthdaySubmit } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('submit birthday of user', () => {
  const mockEmail = 'cypress@gmail.com';
  const mockAge = 18;
  const info = {} as GraphQLResolveInfo;
  const userId = '675675e84bd85fce3de34006';

  it('should return updated user when update is successful', async () => {
    const mockUser = {
      email: mockEmail,
      age: mockAge,
    };

    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const result = await birthdaySubmit!({}, { input: { age: mockAge } }, { userId }, info);
    expect(result).toEqual({ age: mockUser.age, email: mockUser.email });
  });

  it('should throw an error when user is not found', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(birthdaySubmit!({}, { input: { age: mockAge } }, { userId }, info)).rejects.toThrow('Could not find user');
  });
});
