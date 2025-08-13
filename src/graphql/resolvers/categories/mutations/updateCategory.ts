import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const updateCategory = async (_: any, { id, input }: { id: string; input: any }, context: any) => {
  try {
    // Check if user is authenticated and has permission
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    const category = await prisma.productCategory.update({
      where: { id: BigInt(id) },
      data: {
        name: input.name,
        subName: input.subName,
        hindiName: input.hindiName,
        image: input.image,
        featured: input.featured,
        status: input.status,
        orderIndex: input.orderIndex,
      },
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

    return category;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      throw new GraphQLError('Category not found');
    }
    throw new GraphQLError('Failed to update category');
  }
};
