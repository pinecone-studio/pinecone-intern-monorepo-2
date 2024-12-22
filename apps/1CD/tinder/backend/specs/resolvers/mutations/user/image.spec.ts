import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { imageSubmit } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('submit birthday of user', () => {
  const mockEmail = 'cypress@gmail.com';
  const mockUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1609459200/sample.jpg';
  const info = {} as GraphQLResolveInfo;
  const userId = '675675e84bd85fce3de34006';

  it('should return updated user when update is successful', async () => {
    const mockUser = {
      email: mockEmail,
      photos: [mockUrl],
    };

    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const result = await imageSubmit!({}, { input: { photos: [mockUrl] } }, { userId }, info);
    expect(result).toEqual({ photos: mockUser.photos, email: mockUser.email });
  });

  it('should throw an error when user is not found', async () => {
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(imageSubmit!({}, { input: { photos: [mockUrl] } }, { userId }, info)).rejects.toThrow('Could not find user');
  });
});
