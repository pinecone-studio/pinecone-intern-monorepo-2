import { BookModel } from '../../../../models';
import { Book, QueryResolvers } from '../../../generated';

export const getBooks: QueryResolvers['getBooks'] = async () => {
  const books = await BookModel.find({}).populate<Book>('author');

  return books;
};
