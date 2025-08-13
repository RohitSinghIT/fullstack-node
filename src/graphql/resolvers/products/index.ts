import { mergeResolvers } from '@graphql-tools/merge';
import { productQueries } from './queries';
import { productMutations } from './mutations';

export const productResolvers = mergeResolvers([
  { Query: productQueries },
  { Mutation: productMutations },
]);
