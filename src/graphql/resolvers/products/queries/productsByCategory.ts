import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const productsByCategory = async (_: any, { categoryId }: { categoryId: string }) => {
  try {
    const categoryLinks = await prisma.productCategoryLink.findMany({
      where: { categoryId: BigInt(categoryId) },
      include: {
        product: {
          where: { isDeleted: false },
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
        },
      },
    });

    return categoryLinks.map(link => link.product).filter(Boolean);
  } catch (error) {
    throw new GraphQLError('Failed to fetch products by category');
  }
};
