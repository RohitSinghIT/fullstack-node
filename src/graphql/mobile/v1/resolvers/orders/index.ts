import { mergeResolvers } from '@graphql-tools/merge';
import { orderQueries } from './queries';
import { orderMutations } from './mutations';

export const orderResolvers = mergeResolvers([
  { Query: orderQueries },
  { Mutation: orderMutations },
]); 