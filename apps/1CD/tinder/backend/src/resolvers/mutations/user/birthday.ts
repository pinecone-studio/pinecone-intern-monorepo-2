// import { userModel } from '../../../models';

// export const birthdaySubmit = async (_:unknown, { email, age } : { email: string, age: string }) => {
//   const ageDate = new Date(age);

//   const updateUser = await userModel.findByIdAndUpdate(
//     email,
//     { age: ageDate, updatedAt: new Date() },
//     { new: true }
//   )

//   if (!updateUser) throw new Error('Could not find user');

//   return updateUser;

// };

// import { MutationResolvers } from '../../../generated';
// import { userModel } from '../../../models';

// export const birthdaySubmit: MutationResolvers['birthdaySubmit'] = async (_, { email, age }) => {
//   const ageDate = new Date(age);

//   const updateUser = await userModel.findByIdAndUpdate(
//     email,
//     { age: ageDate, updatedAt: new Date() },
//     { new: true }
//   )

//   if (!updateUser) throw new Error('Could not find user');

//   return updateUser;

// };

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
