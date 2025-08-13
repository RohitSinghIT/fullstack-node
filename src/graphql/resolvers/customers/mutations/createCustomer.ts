import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const createCustomer = async (_: any, { input }: { input: any }) => {
  try {
    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const customer = await prisma.customer.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        mobile: input.mobile,
        alternateMobile: input.alternateMobile,
        referralCode,
        status: 'ACTIVE',
        verified: false,
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
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new GraphQLError('Customer with this email or mobile already exists');
    }
    throw new GraphQLError('Failed to create customer');
  }
};
