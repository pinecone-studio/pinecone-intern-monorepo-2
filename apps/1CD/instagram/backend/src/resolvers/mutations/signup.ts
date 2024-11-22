import { MutationResolvers } from '../../generated';
import { userModel } from '../../models/user.model';

const checkExistingUser = async (email: string) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
};

export const signup: MutationResolvers['signup'] = async (_, { input }) => {
  try {
    await checkExistingUser(input.email);
    const newUser = await userModel.create(input);
    return newUser;
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'User already exists') {
      throw error;
    }
    throw new Error('Failed to signup');
  }
};
