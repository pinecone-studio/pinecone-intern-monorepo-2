import { updateUserData } from '../../../../src/resolvers/mutations/user/update-user-mutation';
import { userModel } from '../../../../src/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { AccountVisibility, UpdateInput } from 'src/generated';

jest.mock('../../../../src/models/user.model');

describe('updateUserData', () => {
  const userId = 'userId';
  const inputData: UpdateInput = {
    _id: userId,
    userName: 'UpdatedUserName',
    fullName: 'Updated Full Name',
    bio: 'Updated Bio',
    gender: 'male',
    profileImg: 'updated-image-url',
    accountVisibility: 'PUBLIC' as AccountVisibility,
  };

  it('should update user data successfully', async () => {
    const mockUser = { ...inputData, updatedAt: new Date() };
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserData!({}, { input: inputData }, { userId: null }, {} as GraphQLResolveInfo);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      {
        userName: inputData.userName,
        fullName: inputData.fullName,
        bio: inputData.bio,
        gender: inputData.gender,
        profileImg: inputData.profileImg,
        accountVisibility: inputData.accountVisibility,
      },
      { new: true }
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if user data could not be updated', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateUserData!({}, { input: inputData }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Could not update user data');
  });
});
