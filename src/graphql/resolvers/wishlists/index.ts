import { mergeResolvers } from '@graphql-tools/merge';
import { wishlistsQueries } from './queries';
import { wishlistsMutations } from './mutations';

export const wishlistsResolvers = mergeResolvers([
  { Query: wishlistsQueries },
  { Mutation: wishlistsMutations },
]);
