import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const customerByEmail = async (_: any, { email }: { email: string }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
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

    if (!customer) {
      throw new GraphQLError('Customer not found');
    }

    return customer;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to fetch customer by email');
  }
};
