import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const featuredCategories = async () => {
  try {
    return await prisma.productCategory.findMany({
      where: {
        featured: true,
        isDeleted: false,
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
      orderBy: { orderIndex: 'asc' },
    });
  } catch (error) {
    throw new GraphQLError('Failed to fetch featured categories');
  }
};
