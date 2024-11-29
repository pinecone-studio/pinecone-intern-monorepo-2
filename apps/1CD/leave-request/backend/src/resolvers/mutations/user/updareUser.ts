import { MutationResolvers } from "../../../generated";
import { UserModel } from "../../../models";
export const updateUser: MutationResolvers['updateUser'] = async (_:unknown, { email, role, supervisor,position }) => {
  const userRole = await UserModel.findOne({ email });
  if (!userRole) {
    throw new Error('Could not find user');
  }
  const Role = await UserModel.findOneAndUpdate(_, {email, role, supervisor,position }, { new: true });
  return Role;
}