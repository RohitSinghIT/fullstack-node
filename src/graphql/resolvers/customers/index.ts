import { mergeResolvers } from '@graphql-tools/merge';
import { customerQueries } from './queries';
import { customerMutations } from './mutations';

export const customerResolvers = mergeResolvers([
  { Query: customerQueries },
  { Mutation: customerMutations },
]);
