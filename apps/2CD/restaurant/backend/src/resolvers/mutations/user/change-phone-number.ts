import { User } from 'src/models/user.model';
import { findUserByEmail } from '../user/user-helpers';

type ChangePhoneNumberType = {
  email: string;
  newPhoneNumber: string;
};

export const changePhoneNumber = async (_: unknown, { input }: { input: ChangePhoneNumberType }) => {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error('User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    phoneNumber: input.newPhoneNumber,
  });

  return {
    success: true,
    message: 'Phone number changed successfuly',
  };
};
