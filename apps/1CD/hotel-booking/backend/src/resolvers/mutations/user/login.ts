import { MutationResolvers } from '../../../generated';
import jwt from 'jsonwebtoken';
import { userModel } from '../../../models';

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
    process.env.JWT_SECRET!,
    {
      expiresIn: '2h',
    }
  );

  return {
    user,
    token,
  };
};
