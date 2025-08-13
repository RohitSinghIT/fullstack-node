import { Context } from '../../../types/context';

export const getProductsByCategory = async (
  _: any,
  { category }: { category: string },
  { prisma }: Context
) => {
  try {
    const products = await prisma.product.findMany({
      where: { 
        category,
        isActive: true,
      },
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
    throw new Error(`Failed to fetch products by category: ${error}`);
  }
}; 