import { mergeResolvers } from '@graphql-tools/merge';
import { deliveryQueries } from './queries';
import { deliveryMutations } from './mutations';

export const deliveryResolvers = mergeResolvers([
  { Query: deliveryQueries },
  { Mutation: deliveryMutations },
]);
