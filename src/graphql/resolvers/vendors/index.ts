import { mergeResolvers } from '@graphql-tools/merge';
import { vendorsQueries } from './queries';
import { vendorsMutations } from './mutations';

export const vendorsResolvers = mergeResolvers([
  { Query: vendorsQueries },
  { Mutation: vendorsMutations },
]);
