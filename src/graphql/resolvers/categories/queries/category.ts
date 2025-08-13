import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const category = async (_: any, { id }: { id: string }) => {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { id: BigInt(id) },
      include: {
        createdBy: true,
        categoryLinks: {
          include: {
            product: true,
          },
        },
        variants: true,
      },
    });

    if (!category || category.isDeleted) {
      throw new GraphQLError('Category not found');
    }

    return category;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to fetch category');
  }
};
