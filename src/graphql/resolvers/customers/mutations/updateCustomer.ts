import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const updateCustomer = async (_: any, { id, input }: { id: string; input: any }) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: BigInt(id) },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        mobile: input.mobile,
        alternateMobile: input.alternateMobile,
        status: input.status,
      },
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

    return customer;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      throw new GraphQLError('Customer not found');
    }
    throw new GraphQLError('Failed to update customer');
  }
};
