import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const addProductToCategory = async (_: any, { productId, categoryId }: { productId: string; categoryId: string }, context: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: BigInt(productId) },
    });

    if (!product || product.isDeleted) {
      throw new GraphQLError('Product not found');
    }

    // Check if category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: BigInt(categoryId) },
    });

    if (!category || category.isDeleted) {
      throw new GraphQLError('Category not found');
    }

    // Check if link already exists
    const existingLink = await prisma.productCategoryLink.findFirst({
      where: {
        productId: BigInt(productId),
        categoryId: BigInt(categoryId),
      },
    });

    if (existingLink) {
      throw new GraphQLError('Product is already in this category');
    }

    // Create category link
    const categoryLink = await prisma.productCategoryLink.create({
      data: {
        productId: BigInt(productId),
        categoryId: BigInt(categoryId),
      },
      include: {
        product: true,
        category: true,
      },
    });

    return categoryLink;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to add product to category');
  }
};
