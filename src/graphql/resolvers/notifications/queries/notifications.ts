import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const notifications = async () => {
  // TODO: Implement notifications query
  // Copy implementation from original notifications.ts file
  throw new GraphQLError('Not implemented yet');
};
