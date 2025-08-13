import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const removeProductFromCategory = async (_: any, { productId, categoryId }: { productId: string; categoryId: string }, context: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Find and delete the category link
    const categoryLink = await prisma.productCategoryLink.findFirst({
      where: {
        productId: BigInt(productId),
        categoryId: BigInt(categoryId),
      },
    });

    if (!categoryLink) {
      throw new GraphQLError('Product is not in this category');
    }

    await prisma.productCategoryLink.delete({
      where: { id: categoryLink.id },
    });

    return true;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to remove product from category');
  }
};
