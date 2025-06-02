import { User } from 'src/models/user.model';

type ChangeEmailType = {
  _id: string;
  newEmail: string;
};

export const changeEmail = async (_: unknown, { input }: { input: ChangeEmailType }) => {
  await User.findByIdAndUpdate(input._id, {
    email: input.newEmail,
  });
  return {
    success: true,
    message: 'Email changed successfuly',
  };
};
