import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import jwt from 'jsonwebtoken';

export const login: MutationResolvers['login'] = async (_, { input }) => {
  const { email, password } = input;

  const user = await userModel.findOne({
    email,
    password,
  });

  if (!user) throw new Error('Invalid credentials');

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET!
  );

  return {
    user,
    token,
  };
};
