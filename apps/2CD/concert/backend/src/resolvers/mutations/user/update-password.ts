import { MutationResolvers, Response } from 'src/generated';
import bcrypt from 'bcrypt';
import { updatePassZod } from 'src/zodSchemas/user.zod';
import { userModel } from 'src/models';

export const updatePass: MutationResolvers['updatePass'] = async (_, { input }) => {
  const values = updatePassZod.parse(input);
  const hashedPass = await bcrypt.hash(values.password, 8);
  const passUpdatedUser = await userModel.findByIdAndUpdate(values.id, { password: hashedPass }, { new: true });
  if (!passUpdatedUser) {
    throw new Error('User not found');
  }
  return Response.Success;
};
