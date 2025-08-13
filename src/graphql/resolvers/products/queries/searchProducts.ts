import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const searchProducts = async (_: any, { query }: { query: string }) => {
  try {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { productHindiName: { contains: query, mode: 'insensitive' } },
          { searchTags: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
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
    throw new GraphQLError('Failed to search products');
  }
};
