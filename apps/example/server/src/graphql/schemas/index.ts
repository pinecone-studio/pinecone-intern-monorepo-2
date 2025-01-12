import { mergeTypeDefs } from '@graphql-tools/merge';
import { authorTypeDefs } from './author.schema';
import { bookTypeDefs } from './book.schema';

export const typeDefs = mergeTypeDefs([authorTypeDefs, bookTypeDefs]);
