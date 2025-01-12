import { BookModel } from '../../../../models';
import { Book, QueryResolvers } from '../../../generated';

export const getBook: QueryResolvers['getBook'] = async (_, { _id }) => {
  const book = await BookModel.findById(_id).populate<Book>('author');

  if (!book) {
    throw new Error('Book not found');
  }

  return book as Book;
};
