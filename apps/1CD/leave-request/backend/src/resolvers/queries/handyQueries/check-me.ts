import { checkToken } from 'src/utils/check-token';
import { QueryResolvers } from '../../../generated';

export const checkMe: QueryResolvers['checkMe'] = (_, { roles }) => {
  const isValid = checkToken(roles);
  return { res: isValid };
};
