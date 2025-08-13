import { mergeResolvers } from '@graphql-tools/merge';
import { usersQueries } from './queries';
import { usersMutations } from './mutations';

export const usersResolvers = mergeResolvers([
  { Query: usersQueries },
  { Mutation: usersMutations },
]);
