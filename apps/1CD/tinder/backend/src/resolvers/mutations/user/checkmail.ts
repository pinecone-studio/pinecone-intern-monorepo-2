import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';

export const checkEmail: MutationResolvers['checkEmail'] = async (_, { input }) => {
  const { email } = input;
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new GraphQLError('Email not found', {
      extensions: { code: 'EMAIL_NOT_FOUND' },
    });
  }

  return { message: 'Email exists' };
};
