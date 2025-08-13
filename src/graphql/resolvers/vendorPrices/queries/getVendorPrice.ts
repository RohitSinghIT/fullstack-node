import { Context } from '../../../types/context';

export const getVendorPrice = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    const vendorPrice = await prisma.vendorPrice.findUnique({
      where: { id },
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

    if (!vendorPrice) {
      throw new Error('Vendor price not found');
    }

    return vendorPrice;
  } catch (error) {
    throw new Error(`Failed to fetch vendor price: ${error}`);
  }
}; 