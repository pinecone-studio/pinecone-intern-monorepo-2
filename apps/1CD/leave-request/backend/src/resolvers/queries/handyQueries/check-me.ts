import { checkToken } from 'src/utils/check-token';
import { QueryResolvers } from '../../../generated';

export const checkMe: QueryResolvers['checkMe'] = (_, { roles }, context) => {
  const isValid = checkToken(roles, context);
  return { res: isValid };
};
