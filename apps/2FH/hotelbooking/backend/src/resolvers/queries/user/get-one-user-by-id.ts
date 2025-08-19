import { UserModel } from 'src/models';
import mongoose from 'mongoose';

type UserId = { _id: string };

function validateId(id: string) {
  if (!id || id.trim() === '') throw new Error('Please provide user ID.');
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error(`Invalid user ID: ${id}`);
}

async function fetchUserById(_id: string) {
  const user = await UserModel.findById(_id).select('-password');
  if (!user) throw new Error(`User not found with id ${_id}`);
  return user;
}

export const getUserById = async (_: unknown, { input }: { input: UserId }) => {
  const { _id } = input;

  validateId(_id);

  try {
    return await fetchUserById(_id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
    throw error;
  }
};
