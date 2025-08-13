import { Context } from '../../../types/context';

export const getProduct = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error}`);
  }
}; 