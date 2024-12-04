import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login: MutationResolvers['login'] = async (_, { input }) => {
  const { email, password } = input;

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) throw new Error('Хэрэглэгчийн нууц үг тохирохгүй байна.');

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET!
  );

  return { user, token };
};
