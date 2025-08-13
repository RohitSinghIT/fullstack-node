import { mergeResolvers } from '@graphql-tools/merge';
import { categoryQueries } from './queries';
import { categoryMutations } from './mutations';

export const categoryResolvers = mergeResolvers([
  { Query: categoryQueries },
  { Mutation: categoryMutations },
]);
