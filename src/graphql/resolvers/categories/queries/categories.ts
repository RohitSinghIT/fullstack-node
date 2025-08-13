import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const categories = async () => {
  try {
    return await prisma.productCategory.findMany({
      where: { isDeleted: false },
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
    throw new GraphQLError('Failed to fetch categories');
  }
};
