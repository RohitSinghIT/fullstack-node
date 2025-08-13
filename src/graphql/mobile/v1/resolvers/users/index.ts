import { mergeResolvers } from '@graphql-tools/merge';
import { userMutations } from './mutations';

export const userResolvers = mergeResolvers([
  { Mutation: userMutations },
]); 