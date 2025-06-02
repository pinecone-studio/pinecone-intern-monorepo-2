import { MutationResolvers, Response } from 'src/generated';
import { userModel } from 'src/models';
import { updateUserZod } from 'src/zodSchemas/user.zod';

export const updateUser: MutationResolvers['updateUser'] = async (_, { input }) => {
  const values = updateUserZod.parse(input);
  const emailExist = await userModel.findOne({ email: values.email });
  if (emailExist) {
    throw new Error('Email exist enter other email.');
  }
  const updatedUser = await userModel.findByIdAndUpdate(values.id, { email: values.email, phone: values.phone }, { new: true });
  if (!updatedUser) {
    throw new Error('User not found');
  }

  return Response.Success;
};
