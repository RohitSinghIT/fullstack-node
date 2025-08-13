import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const me = async () => {
  // TODO: Implement me query
  // Copy implementation from original users.ts file
  throw new GraphQLError('Not implemented yet');
};
