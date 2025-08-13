import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const configs = async () => {
  // TODO: Implement configs query
  // Copy implementation from original configs.ts file
  throw new GraphQLError('Not implemented yet');
};
