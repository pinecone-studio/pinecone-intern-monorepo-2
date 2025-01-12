import { BookModel } from '../../../../models';
import { Book, MutationResolvers } from '../../../generated';

export const createBook: MutationResolvers['createBook'] = async (_, { title, authorId }) => {
  const book = await BookModel.create({ title, author: authorId });
  const populatedBook = (await book.populate('author')) as Book;

  return populatedBook;
};
