import { mergeResolvers } from '@graphql-tools/merge';
import { reviewsQueries } from './queries';
import { reviewsMutations } from './mutations';

export const reviewsResolvers = mergeResolvers([
  { Query: reviewsQueries },
  { Mutation: reviewsMutations },
]);
