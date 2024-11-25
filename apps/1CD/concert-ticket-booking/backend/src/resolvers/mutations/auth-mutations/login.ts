import { MutationResolvers } from '../../../generated';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { generateToken } from '../../../utils/generate-token';

export const login: MutationResolvers['login'] = async (_: unknown, { email, password }) => {
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
