import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';

export const birthdaySubmit: MutationResolvers['birthdaySubmit'] = async (_, { input }) => {
  const { age, email } = input;
  console.log('Input received:', { age, email });

  const ageDate = new Date(age);
  console.log('Parsed age date:', ageDate);

  const updateUser = await userModel.findOneAndUpdate(
    { email },
    {
      $set: {
        age,
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!updateUser) throw new Error('Could not find user');

  return updateUser.email;
};
