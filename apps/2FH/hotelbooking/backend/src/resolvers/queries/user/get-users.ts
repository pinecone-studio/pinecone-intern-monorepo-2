import { UserModel } from 'src/models';

type UserType = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  dateOfBirth?: string;
};

export const getUsers = async (_: unknown, { input }: { input: UserType }) => {
  const query: Partial<UserType> = {};
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) query[key as keyof UserType] = value;
  });

  try {
    const users = await UserModel.find(query).select('-password');

    if (!users || users.length === 0) {
      throw new Error('User not found');
    }

    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
