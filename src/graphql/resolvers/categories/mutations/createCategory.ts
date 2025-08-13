import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const createCategory = async (_: any, { input }: { input: any }, context: any) => {
  try {
    // Check if user is authenticated and has permission
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    const category = await prisma.productCategory.create({
      data: {
        name: input.name,
        subName: input.subName,
        hindiName: input.hindiName,
        image: input.image,
        featured: input.featured || false,
        status: input.status || 'true',
        orderIndex: input.orderIndex || 0,
        isDeleted: false,
        createdById: BigInt(context.user.id),
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
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to create category');
  }
};
