import { UserModel } from 'src/models';

type UserType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  dateOfBirth?: string;
};

async function validateUserExists(_id: string, email?: string) {
  if (!email) {
    throw new Error('Please enter email');
  }
  const existingUser = await UserModel.findOne({ email });
  if (existingUser && existingUser._id.toString() !== _id) {
    throw new Error('Email is already in use by another user.');
  }
}

export const updateUser = async (_: unknown, { input }: { input: UserType & { _id: string } }) => {
  const { _id, firstName, lastName, email, password, role, dateOfBirth } = input;

  if (!_id) throw new Error('User ID is required');

  await validateUserExists(_id, email);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(_id, { firstName, lastName, email, password, role, dateOfBirth }, { new: true });

    if (!updatedUser) throw new Error('User not found');

    console.log(`${email} user successsfully updated.`);

    return {
      ...updatedUser.toObject(),
      password: undefined,
    };
  } catch (error) {
    throw new Error(`Update database error: ${error}`);
  }
};
