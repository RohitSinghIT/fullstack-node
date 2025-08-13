import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const vendorByUserId = async (_: any, { userId }: { userId: string }) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId },
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
          _count: true,
        },
        orders: {
          _count: true,
        },
      },
    });

    if (!vendor) {
      throw new GraphQLError('Vendor not found for this user');
    }

    return vendor;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to fetch vendor by user ID');
  }
};
