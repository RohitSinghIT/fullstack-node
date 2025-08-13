import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const featuredProducts = async () => {
  try {
    return await prisma.product.findMany({
      where: {
        featured: true,
        isDeleted: false,
      },
      include: {
        createdBy: true,
        categoryLinks: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            vendorProduct: {
              include: {
                vendor: true,
              },
            },
            category: true,
          },
        },
        vendorProducts: {
          include: {
            vendor: true,
            variants: true,
          },
        },
        orderDetails: true,
        returns: true,
        reviewRatings: true,
        features: true,
      },
      orderBy: { orderIndex: 'asc' },
    });
  } catch (error) {
    throw new GraphQLError('Failed to fetch featured products');
  }
};
