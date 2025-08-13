import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const getVendor = async (_: any, { id }: { id: string }) => {
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
          },
        },
        vendorProducts: {
          where: { isActive: true },
          include: {
            product: {
              include: {
                category: true,
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
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
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