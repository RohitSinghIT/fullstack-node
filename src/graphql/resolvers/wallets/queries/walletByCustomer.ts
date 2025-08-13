import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const walletByCustomer = async () => {
  // TODO: Implement walletByCustomer query
  // Copy implementation from original wallets.ts file
  throw new GraphQLError('Not implemented yet');
};
