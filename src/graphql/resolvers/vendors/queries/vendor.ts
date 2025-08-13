import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const vendor = async (_: any, { id }: { id: string }) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        vendorProducts: {
          where: { isActive: true },
          include: {
            product: {
              include: {
                variants: true,
                category: true,
              },
            },
            prices: {
              include: {
                variant: true,
              },
            },
          },
        },
        orders: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobile: true,
              },
            },
            orderDetails: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        vendorTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      throw new GraphQLError('Vendor not found');
    }

    return vendor;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to fetch vendor');
  }
};
