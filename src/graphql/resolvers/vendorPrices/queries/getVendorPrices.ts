import { Context } from '../../../types/context';

export const getVendorPrices = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    const vendorPrices = await prisma.vendorPrice.findMany({
      where: { isActive: true },
      include: {
        vendorProduct: {
          include: {
            vendor: true,
            product: true,
          },
        },
        variant: true,
      },
    });

    return vendorPrices;
  } catch (error) {
    throw new Error(`Failed to fetch vendor prices: ${error}`);
  }
}; 