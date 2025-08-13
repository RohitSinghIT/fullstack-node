import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const toggleTwoFactor = async () => {
  // TODO: Implement toggleTwoFactor mutation
  // Copy implementation from original users.ts file
  throw new GraphQLError('Not implemented yet');
};
