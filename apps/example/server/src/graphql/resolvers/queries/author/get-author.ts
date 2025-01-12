import { AuthorModel } from '../../../../models';
import { QueryResolvers } from '../../../generated';

export const getAuthor: QueryResolvers['getAuthor'] = async (_, { _id }) => {
  const author = await AuthorModel.findById(_id);

  if (!author) {
    throw new Error('Author not found');
  }

  return author;
};
