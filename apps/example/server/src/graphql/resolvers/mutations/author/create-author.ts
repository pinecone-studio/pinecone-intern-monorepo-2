import { AuthorModel } from '../../../../models';
import { MutationResolvers } from '../../../generated';

export const createAuthor: MutationResolvers['createAuthor'] = async (_, { name }) => {
  const author = await AuthorModel.create({ name });

  return author;
};
