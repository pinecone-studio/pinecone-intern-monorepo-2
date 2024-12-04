import { userModel } from '../../../models/user.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AccountVisibility } from '../../../generated';
import { MutationResolvers } from '../../../generated';

export const signup: MutationResolvers['signup'] = async (_: unknown, { input }) => {
  const { email, accountVisibility = AccountVisibility.Public } = input;

  const user = await userModel.findOne({ email });

  if (user) throw new Error('User already exists');

  const newPassword = crypto.randomBytes(25).toString('hex');
  const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

  const newUser = await userModel.create({
    ...input,
    password: hashedPassword,
    accountVisibility,
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
