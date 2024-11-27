import { MutationResolvers } from '../../generated';
import { userModel } from '../../models/user.model';
import jwt from 'jsonwebtoken';

export const signup: MutationResolvers['signup'] = async (_, { input }) => {
  const { email } = input;

  const user = await userModel.findOne({ email });

  if (user) throw new Error('User already exists');

  const newUser = await userModel.create({
    ...input,
  });

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
