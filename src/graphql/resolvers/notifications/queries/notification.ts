import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const notification = async () => {
  // TODO: Implement notification query
  // Copy implementation from original notifications.ts file
  throw new GraphQLError('Not implemented yet');
};
