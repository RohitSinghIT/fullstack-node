import { Context } from '../../../types/context';

export const getProducts = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        variants: true,
        vendorProducts: {
          include: {
            vendor: true,
            prices: {
              include: {
                variant: true,
              },
            },
          },
        },
      },
    });

    return products;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error}`);
  }
}; 