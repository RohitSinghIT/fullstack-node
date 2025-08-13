import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const customers = async () => {
  try {
    return await prisma.customer.findMany({
      include: {
        addresses: true,
        wallets: true,
        wishlists: true,
        orders: true,
        returns: true,
        feedbacks: true,
        reviewRatings: true,
        devices: true,
        womenEmpowerment: true,
        invoices: true,
      },
    });
  } catch (error) {
    throw new GraphQLError('Failed to fetch customers');
  }
};
