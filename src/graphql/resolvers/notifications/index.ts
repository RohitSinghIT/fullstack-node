import { mergeResolvers } from '@graphql-tools/merge';
import { notificationsQueries } from './queries';
import { notificationsMutations } from './mutations';

export const notificationsResolvers = mergeResolvers([
  { Query: notificationsQueries },
  { Mutation: notificationsMutations },
]);
