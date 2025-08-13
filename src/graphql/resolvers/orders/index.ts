import { mergeResolvers } from '@graphql-tools/merge';
import { ordersQueries } from './queries';
import { ordersMutations } from './mutations';

export const ordersResolvers = mergeResolvers([
  { Query: ordersQueries },
  { Mutation: ordersMutations },
]);
