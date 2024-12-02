import { MutationResolvers } from '../../generated';
import { userModel } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import { AccountVisibility } from '../../generated';

export const signup: MutationResolvers['signup'] = async (_: unknown, { input }) => {
  const { email, accountVisibility = AccountVisibility.Public } = input;

  const user = await userModel.findOne({ email });

  if (user) throw new Error('User already exists');

  const newUser = await userModel.create({
    ...input,
    accountVisibility,
  });

  console.log({ newUser });

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.JWT_SECRET
  );

  return {
    user: newUser,
    token,
  };
};
