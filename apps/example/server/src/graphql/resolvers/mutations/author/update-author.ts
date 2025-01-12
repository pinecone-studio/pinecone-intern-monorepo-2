import { AuthorModel } from '../../../../models';
import { MutationResolvers } from '../../../generated';

export const updateAuthor: MutationResolvers['updateAuthor'] = async (_, { _id, name }) => {
  const author = await AuthorModel.findByIdAndUpdate(_id, { name }, { new: true });

  if (!author) {
    throw new Error('Author not found');
  }

  return author;
};
