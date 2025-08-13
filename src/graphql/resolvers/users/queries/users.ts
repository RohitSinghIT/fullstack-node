import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const users = async () => {
  // TODO: Implement users query
  // Copy implementation from original users.ts file
  throw new GraphQLError('Not implemented yet');
};
