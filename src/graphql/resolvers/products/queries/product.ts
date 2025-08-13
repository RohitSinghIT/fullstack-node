import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const product = async (_: any, { id }: { id: string }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
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
    });

    if (!product || product.isDeleted) {
      throw new GraphQLError('Product not found');
    }

    return product;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to fetch product');
  }
};
