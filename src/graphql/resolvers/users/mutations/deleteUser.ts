import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteUser = async () => {
  // TODO: Implement deleteUser mutation
  // Copy implementation from original users.ts file
  throw new GraphQLError('Not implemented yet');
};
