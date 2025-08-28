import { UserModel } from 'src/models';

export type DeleteUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role: string;
};

export const deleteUser = async (_: unknown, { input }: { input: DeleteUser }) => {
  try {
    if (input.role === 'user') throw new Error('You do not have permission to delete.');

    const deletedUser = await UserModel.findByIdAndDelete(input._id).select('-password');
    if (!deletedUser) throw new Error(`User not found`, undefined);

    return `${deletedUser} user deleted`;
  } catch (error) {
    throw new Error(`Delete user database error: ${error}`);
  }
};
