import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const config = async () => {
  // TODO: Implement config query
  // Copy implementation from original configs.ts file
  throw new GraphQLError('Not implemented yet');
};
