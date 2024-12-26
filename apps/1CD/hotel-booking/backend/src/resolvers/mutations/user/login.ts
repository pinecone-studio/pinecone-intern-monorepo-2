import { MutationResolvers } from '../../../generated';
import jwt from 'jsonwebtoken';
import { userModel } from '../../../models';
import bcrypt from 'bcrypt';

export const login: MutationResolvers['login'] = async (_, { input }) => {
  const { email, password } = input;

  const user = await userModel.findOne({
    email,
  });

  if (!user) throw new Error('Email does not exist');

  const isCheck = bcrypt.compareSync(password, user.password);
  if (!isCheck) throw new Error('Wrong password');

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '2h',
    }
  );
  console.log('sdarararara', token);

  return {
    user,
    token,
  };
};
