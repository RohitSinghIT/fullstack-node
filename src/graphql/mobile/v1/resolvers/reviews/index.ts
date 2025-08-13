import { mergeResolvers } from '@graphql-tools/merge';
import { reviewMutations } from './mutations';

export const reviewResolvers = mergeResolvers([
  { Mutation: reviewMutations },
]); 