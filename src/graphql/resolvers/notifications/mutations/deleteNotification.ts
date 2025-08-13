import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteNotification = async () => {
  // TODO: Implement deleteNotification mutation
  // Copy implementation from original notifications.ts file
  throw new GraphQLError('Not implemented yet');
};
