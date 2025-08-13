import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteCustomer = async (_: any, { id }: { id: string }) => {
  try {
    await prisma.customer.delete({
      where: { id: BigInt(id) },
    });

    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      throw new GraphQLError('Customer not found');
    }
    throw new GraphQLError('Failed to delete customer');
  }
};
