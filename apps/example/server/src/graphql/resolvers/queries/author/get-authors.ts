import { AuthorModel } from '../../../../models';
import { QueryResolvers } from '../../../generated';

export const getAuthors: QueryResolvers['getAuthors'] = async () => {
  const authors = await AuthorModel.find({});

  return authors;
};
