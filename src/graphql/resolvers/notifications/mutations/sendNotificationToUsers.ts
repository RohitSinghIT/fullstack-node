import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const sendNotificationToUsers = async () => {
  // TODO: Implement sendNotificationToUsers mutation
  // Copy implementation from original notifications.ts file
  throw new GraphQLError('Not implemented yet');
};
