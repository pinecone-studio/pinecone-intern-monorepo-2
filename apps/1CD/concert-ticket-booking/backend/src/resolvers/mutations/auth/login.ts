import User from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { generateToken } from '../../../utils/generate-token';
import { MutationResolvers } from '../../../generated';

export const login: MutationResolvers['login'] = async (_: unknown, { input }) => {
  const { email, password } = input;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('not found user');
  }
  const isCheck = bcrypt.compareSync(password, user.password);
  if (!isCheck) throw new Error('not match email or password');
  const token = generateToken({ id: user._id });
  return {
    user,
    token,
  };
};
