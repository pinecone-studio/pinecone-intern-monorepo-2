import { AuthorModel } from '../../../../models';
import { QueryResolvers } from '../../../generated';

export const getAuthorsByName: QueryResolvers['getAuthorsByName'] = async (_, { name }) => {
  const res = await AuthorModel.find({ name });

  return res;
};
