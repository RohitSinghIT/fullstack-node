import { Context } from '../../../types/context';

export const getPricesByVendorProduct = async (
  _: any,
  { vendorProductId }: { vendorProductId: string },
  { prisma }: Context
) => {
  try {
    const vendorPrices = await prisma.vendorPrice.findMany({
      where: { 
        vendorProductId,
        isActive: true,
      },
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
    throw new Error(`Failed to fetch prices by vendor product: ${error}`);
  }
}; 