import { BookModel } from '../../../../models';
import { Book, MutationResolvers } from '../../../generated';

export const deleteBook: MutationResolvers['deleteBook'] = async (_, { _id }) => {
  const book = await BookModel.findByIdAndDelete(_id).populate<Book>('author');

  if (!book) {
    throw new Error('Book not found');
  }

  return book as Book;
};
