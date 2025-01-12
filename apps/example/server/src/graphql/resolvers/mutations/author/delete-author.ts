import { AuthorModel } from '../../../../models';
import { MutationResolvers } from '../../../generated';

export const deleteAuthor: MutationResolvers['deleteAuthor'] = async (_, { _id }) => {
  const author = await AuthorModel.findByIdAndDelete(_id);

  if (!author) {
    throw new Error('Author not found');
  }

  return author;
};
