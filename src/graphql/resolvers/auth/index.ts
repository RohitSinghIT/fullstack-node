import { mergeResolvers } from '@graphql-tools/merge';
import { authQueries } from './queries';
import { authMutations } from './mutations';

export const authResolvers = mergeResolvers([
  { Query: authQueries },
  { Mutation: authMutations },
]); 