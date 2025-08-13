import { Context } from '../../../../../../types/context';

export const vendor = async (_: any, { id }: { id: string }, { prisma }: Context) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true },
        include: {
          product: {
            include: {
              variants: {
                where: { isActive: true },
              },
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
      _count: {
        select: {
          products: true,
          orders: true,
        },
      },
    },
  });

  if (!vendor) {
    throw new Error('Vendor not found');
  }

  return vendor;
};
