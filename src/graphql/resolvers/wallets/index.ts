import { mergeResolvers } from '@graphql-tools/merge';
import { walletsQueries } from './queries';
import { walletsMutations } from './mutations';

export const walletsResolvers = mergeResolvers([
  { Query: walletsQueries },
  { Mutation: walletsMutations },
]);
