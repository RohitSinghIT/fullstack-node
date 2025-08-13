import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteProduct = async (_: any, { id }: { id: string }, context: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!product || product.isDeleted) {
      throw new GraphQLError('Product not found');
    }

    // Soft delete by setting isDeleted to true
    await prisma.product.update({
      where: { id: BigInt(id) },
      data: { isDeleted: true },
    });

    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      throw new GraphQLError('Product not found');
    }
    throw new GraphQLError('Failed to delete product');
  }
};
