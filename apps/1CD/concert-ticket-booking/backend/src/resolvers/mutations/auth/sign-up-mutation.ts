import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';

export const signUp: MutationResolvers['signUp'] = async (_, { email, password }) => {
  const user = await User.findOne({ email });

  console.log({ user });

  if (user) throw new Error('User already exists');

  const createUser = await User.create({
    email,
    password,
  });

  console.log({ createUser });

  return createUser;
};
