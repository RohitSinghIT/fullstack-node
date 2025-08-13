import { Context } from '../../../../../../types/context';

export const product = async (_: any, { id }: { id: string }, { prisma }: Context) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        where: { isActive: true },
      },
      vendorProducts: {
        where: { isActive: true },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              logo: true,
              rating: true,
              description: true,
            },
          },
          prices: {
            where: { isActive: true },
            include: {
              variant: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};
