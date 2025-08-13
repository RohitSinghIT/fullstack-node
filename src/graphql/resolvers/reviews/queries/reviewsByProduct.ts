import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const reviewsByProduct = async () => {
  // TODO: Implement reviewsByProduct query
  // Copy implementation from original reviews.ts file
  throw new GraphQLError('Not implemented yet');
};
