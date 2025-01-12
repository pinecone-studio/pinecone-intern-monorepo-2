import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import jwt from 'jsonwebtoken';

export const register: MutationResolvers['register'] = async (_, { input }) => {
  const { email } = input;

  const user = await userModel.findOne({ email });

  if (user) throw new Error('User already exists');

  const newUser = await userModel.create({
    ...input,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.JWT_SECRET!
  );

  return {
    user: newUser,
    token,
  };
};
