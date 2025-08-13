import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteCategory = async (_: any, { id }: { id: string }, context: any) => {
  try {
    // Check if user is authenticated and has permission
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Soft delete by setting isDeleted to true
    await prisma.productCategory.update({
      where: { id: BigInt(id) },
      data: { isDeleted: true },
    });

    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      throw new GraphQLError('Category not found');
    }
    throw new GraphQLError('Failed to delete category');
  }
};
