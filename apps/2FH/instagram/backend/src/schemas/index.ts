import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { StoryTypeDefs } from './story.schema';
import { UserTypeDefs } from './user.schema';
import { PostTypeDefs } from './post.schema';
import { CommentTypeDefs } from './comment.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, StoryTypeDefs, UserTypeDefs,PostTypeDefs,CommentTypeDefs]);
