import { BookModel } from '../../../../models';
import { Book, MutationResolvers } from '../../../generated';

export const updateBook: MutationResolvers['updateBook'] = async (_, { _id, title, authorId }) => {
  const book = await BookModel.findByIdAndUpdate(
    _id,
    {
      title,
      author: authorId,
    },
    { new: true }
  ).populate<Book>('author');

  if (!book) {
    throw new Error('Book not found');
  }

  return book as Book;
};
