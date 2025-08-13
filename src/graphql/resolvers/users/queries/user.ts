import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const user = async () => {
  // TODO: Implement user query
  // Copy implementation from original users.ts file
  throw new GraphQLError('Not implemented yet');
};
