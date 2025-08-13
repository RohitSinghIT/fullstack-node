import { mergeResolvers } from '@graphql-tools/merge';
import { configsQueries } from './queries';
import { configsMutations } from './mutations';

export const configsResolvers = mergeResolvers([
  { Query: configsQueries },
  { Mutation: configsMutations },
]);
