import { Context } from '../../../../../../types/context';

export const categories = async (_: any, __: any, { prisma }: Context) => {
  const categories = await prisma.product.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: {
      category: true,
    },
  });

  return categories.map(cat => ({
    name: cat.category,
    count: cat._count.category,
  }));
};
